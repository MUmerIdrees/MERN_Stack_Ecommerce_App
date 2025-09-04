import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: function () {
                // Only require password if not using Google OAuth
                return !this.googleId;
            },
            minlength: 6,
        },
        googleId: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: function () {
                // Only default true if using Google OAuth
                return !!this.googleId;
            },
        },
        verification_otp: {
            otp: { type: String },
            otp_expire_at: { type: Number, default: 0 },
        },
        password_otp: {
            otp: { type: String },
            limit: { type: Number, default: 5 },
            last_attempt: { type: Object },
            otp_expire_at: { type: Number, default: 0 },
        },
        role: {
            type: String,
            default: "user",
        }
    },
    { timestamps: true } // createdAt, updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;