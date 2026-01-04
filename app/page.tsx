"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitted) {
      timer = setTimeout(() => {
        setShowForm(false);
        setIsSubmitted(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [isSubmitted]);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <main className="flex flex-1 flex-col items-center justify-center w-full gap-8 p-4">

        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-8 w-full max-w-4xl border-none outline-none"
            >
              {/* 
                User Request: "ColdEmail.com in whtie text in a white container agaisnt an entierly black landing page background."
                Interpretation: White text + White Bordered Container to ensure contrast. 
              */}
              <div className="border-2 border-white p-12">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-center">
                  ColdEmail.com
                </h1>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowForm(true)}
                className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors rounded-none h-auto py-4 px-8 text-lg"
              >
                Request Information
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative w-full max-w-[500px] bg-black border-2 border-white text-white p-8 rounded-none outline-none ring-0 focus:ring-0 focus:outline-none"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute right-4 top-4 text-white hover:text-gray-300 transition-colors"
                aria-label="Close form"
              >
                <X className="h-4 w-4" />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="grid gap-6 py-4 [&_input]:bg-black [&_input]:text-white [&_input]:border-white [&_label]:text-white [&_textarea]:bg-black [&_textarea]:text-white [&_textarea]:border-white">
                    <div className="grid w-full gap-2">
                      <Label htmlFor="fullName" className="font-bold text-left text-xs uppercase tracking-wider">*Full Name</Label>
                      <Input id="fullName" className="rounded-none border-white h-10 text-sm" />
                    </div>

                    <div className="grid w-full gap-2">
                      <Label htmlFor="companyDomain" className="font-bold text-left text-xs uppercase tracking-wider">*Company Domain</Label>
                      <Input id="companyDomain" className="rounded-none border-white h-10 text-sm" />
                    </div>

                    <div className="grid w-full gap-2">
                      <Label htmlFor="email" className="font-bold text-left text-xs uppercase tracking-wider">*Email</Label>
                      <Input id="email" type="email" className="rounded-none border-white h-10 text-sm" />
                    </div>

                    <div className="grid w-full gap-2">
                      <Label htmlFor="message" className="font-bold text-left text-xs uppercase tracking-wider">*Message</Label>
                      <Textarea id="message" className="rounded-none border-white min-h-[120px] text-sm resize-none" />
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-white text-black hover:bg-gray-200 border-2 border-white rounded-none font-bold mt-2 h-10 text-sm"
                  >
                    Submit
                  </Button>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <p className="text-white text-xl text-center font-medium">We have received your message.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      <footer className="w-full pb-4 pt-6 text-center">
        <p className="text-sm text-gray-500">© 2026 ColdEmail.com All rights reserved.</p>
      </footer>
    </div>
  );
}
