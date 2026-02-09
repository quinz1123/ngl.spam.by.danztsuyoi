export default async function handler(req, res) {

console.log("CF_SECRET ADA:", !!process.env.CF_SECRET);
  const { link, pesan, cfToken } = req.query;

  if (!link || !pesan || !cfToken) {
    return res.status(400).json({
      status: false,
      message: "Parameter kurang"
    });
  }

  
  const secret = process.env.CF_SECRET;

  try {
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `secret=${secret}&response=${cfToken}`
    });

    const cf = await verify.json();

if (!cf.success) {
  return res.status(403).json({
    status: false,
    cf
  });
}

    // LANJUT KE API ASLI
    const apiUrl = `https://api.deline.web.id/tools/spamngl?url=${encodeURIComponent(link)}&message=${encodeURIComponent(pesan)}`;

    const response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const data = await response.json();

    return res.status(200).json({
      status: true,
      result: data
    });

  } catch (err) {
    return res.status(500).json({
      status: false,
      error: err.message
    });
  }
}