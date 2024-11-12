import { supabase } from "@/lib/dbConnect";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dotenv from "dotenv";
dotenv.config();

export const POST = async (req: Request, res: Response) => {
  const body = await req.json();
  const { email, password } = body;

  try {
    const { data: emailData, error: emailError } = await supabase
      .from("admin")
      .select()
      .eq("email", email)
      .single();

    if (emailError) throw emailError;

    if (!emailData) {
      return NextResponse.json({
        status: 400,
        message: "Email does not exist",
        function_name: "login-emailData",
      });
    }

    const { password: hashedPasswordDB } = emailData;
    const isPasswordMatch = await compare(password, hashedPasswordDB);

    if (!isPasswordMatch) {
      return NextResponse.json({
        status: 400,
        message: "Password does not match",
        function_name: "login-isPasswordMatch",
      });
    }

    const token = jwt.sign(
      { _id: emailData.id, email: emailData.email, username: emailData.username },
      process.env.SECRET_KEY as string,
      {
        expiresIn: "48h",
      }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({
      status: 200,
      message: {
        message: "User logged in successfully",
        token,
      },
      function_name: "login-success",
    });

  } catch (err: any) {
    return NextResponse.json({
      status: 500,
      message: err.message,
      function_name: "login-catch",
    });
  }
};

