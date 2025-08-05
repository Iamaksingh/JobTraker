export const getUserProfile = async (req, res) => {
  try {
    const user = req.user; // set by auth middleware

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Error in getUserProfile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};