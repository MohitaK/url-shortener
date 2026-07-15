import { prisma } from "../db.js";
import { shortCode } from "../utils/shortCode.js";

export const createShortUrl = async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: "longUrl is required" });
  }

  // Checked separately from the `new URL()` check below: URL's constructor
  // coerces its argument to a string before parsing, so a single-element
  // array like ["http://example.com"] would otherwise slip through as a
  // "valid" URL (Array.prototype.toString on one element has no comma to
  // give it away) while still being an array everywhere else in this function.
  if (typeof longUrl !== "string") {
    return res.status(400).json({ error: "longUrl must be a string" });
  }

  // `new URL()` throws on malformed input; this is a well-formedness
  // check, not proof the URL is reachable.
  try {
    new URL(longUrl);
  } catch {
    return res.status(400).json({ error: "longUrl must be a valid URL" });
  }

  const secret = Number(process.env.SHORT_CODE_SECRET);

  try {
    // Wrapped in a transaction so a failure between insert and update
    // (e.g. shortCode collision, DB error) rolls back the insert too,
    // instead of leaving a row stuck with shortCode: null.
    const url = await prisma.$transaction(async (tx) => {
      const created = await tx.url.create({
        data: { longUrl },
      });

      const code = shortCode(created.id, secret);

      return tx.url.update({
        where: { id: created.id },
        data: { shortCode: code },
      });
    });

    return res.status(201).json({
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const redirectToLongUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await prisma.url.findUnique({
      where: { shortCode: code },
    });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Own try/catch, separate from the lookup above: a failed increment
    // shouldn't block the redirect the user is actually waiting on, just
    // cost an undercounted click.
    try {
      await prisma.url.update({
        where: { id: url.id },
        data: { clickCount: { increment: 1 } },
      });
    } catch (error) {
      console.error("Failed to increment click_count:", error);
    }

    return res.redirect(302, url.longUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getClickCountsForShortCode = async (req, res) => {
  const { code } = req.params;

  try {
    const url = await prisma.url.findUnique({ where: { shortCode: code } });

    if (!url) {
      return res.status(404).json({ error: "Url not found." });
    }

    return res.status(200).json({ clickCount: url.clickCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong." });
  }
};