"use client"

import React, { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, XCircle, Loader2, ArrowRight, Mail } from "lucide-react"
import { Button } from "@/components/atom/button"
import { AuthService } from "@/services/auth.service"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token && email ? "loading" : "error"
  )
  const [message, setMessage] = useState<string>(
    !token || !email
      ? "Invalid verification link. Token or email is missing."
      : "Verifying your email..."
  )

  useEffect(() => {
    if (!token || !email) return

    const verify = async () => {
      try {
        const res = await AuthService.verifyEmail(token, email)
        setStatus("success")
        setMessage(
          res?.message || "Email verified successfully! You can now log in."
        )
      } catch (err: any) {
        setStatus("error")
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Verification link has expired or is invalid."
        setMessage(Array.isArray(msg) ? msg[0] : msg)
      }
    }

    verify()
  }, [token, email])

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-8 text-center shadow-xl backdrop-blur-xl">
      {status === "loading" && (
        <div className="flex flex-col items-center py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground">
            Verifying your email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground">
            Email Verified!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>

          <Link href="/login" className="mt-6 w-full">
            <Button className="w-full gap-2 font-semibold">
              <span>Continue to Login</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground">
            Verification Failed
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>

          <div className="mt-6 flex w-full flex-col gap-2">
            <Link href="/register" className="w-full">
              <Button className="w-full font-semibold">Register Again</Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-border bg-card/70 p-8 text-center shadow-xl backdrop-blur-xl">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading verification...
          </p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
