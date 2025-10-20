// POST /signup
exports.studentSignup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const referralCode = req.body.referralCode || req.cookies.referralCode || "direct";

    // Create the student
    const student = await Child.create({ username, password, referralCode });

    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Update previous visits linked to this referralCode and IP
    await Visit.updateMany(
      { ip, referralCode, signedUp: false },
      { signedUp: true, userId: student._id }
    );

    // Notify the admin who owns this referral code
    try {
      const admin = await Admin.findOne({ referralCode });
      if (admin) {
        const result = await sendWhatsApp(
          admin.phone,
          `🎉 ${username} just signed up using referral code: ${referralCode}\nIP: ${ip}`,
          admin.apikey
        );
        console.log("WhatsApp sent:", result);
      } else {
        console.log("No admin found for referral code:", referralCode);
      }
    } catch (err) {
      console.error("WhatsApp error:", err.message);
    }

    // ✅ Finally send response
    res.status(201).json({ success: true, student });

  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};