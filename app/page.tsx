"use client";

// MODE TOGGLE: Set to true for "Coming Soon" mode, false for normal functionality
const COMING_SOON_MODE = true;

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

  const [formData, setFormData] = useState({
    companyName: '',
    companyDomain: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    companyName: false,
    companyDomain: false,
    email: false,
    message: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      companyName: !formData.companyName.trim(),
      companyDomain: !formData.companyDomain.trim(),
      email: !formData.email.trim(),
      message: !formData.message.trim()
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some(Boolean)) {
      try {
        await fetch('https://eosffd61t937pcq.m.pipedream.net', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      setIsSubmitted(true);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setErrors({
      companyName: false,
      companyDomain: false,
      email: false,
      message: false
    });
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
                onClick={COMING_SOON_MODE ? undefined : () => setShowForm(true)}
                className={`bg-transparent text-white border-white transition-colors rounded-none h-auto py-4 px-8 text-lg ${
                  COMING_SOON_MODE
                    ? "cursor-default opacity-80"
                    : "hover:bg-white hover:text-black"
                }`}
              >
                {COMING_SOON_MODE ? "Coming Soon" : "Submit Interest"}
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
              {!isSubmitted && (
                <button
                  onClick={handleCloseForm}
                  className="absolute right-4 top-4 text-white hover:text-gray-300 transition-colors"
                  aria-label="Close form"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {!isSubmitted ? (
                <>
                  <div className="grid gap-6 py-4 [&_input]:bg-black [&_input]:text-white [&_input]:border-white [&_label]:text-white [&_textarea]:bg-black [&_textarea]:text-white [&_textarea]:border-white">
                    <div className="grid w-full gap-2">
                      <Label htmlFor="companyName" className="font-bold text-left text-xs uppercase flex items-center gap-0">
                        <span className={errors.companyName ? "text-red-500" : "text-white"}>*</span><span className="tracking-wider">Company Name</span>
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="rounded-none border-white h-10 text-sm"
                      />
                    </div>

                    <div className="grid w-full gap-2">
                      <Label htmlFor="companyDomain" className="font-bold text-left text-xs uppercase flex items-center gap-0">
                        <span className={errors.companyDomain ? "text-red-500" : "text-white"}>*</span><span className="tracking-wider">Company Domain</span>
                      </Label>
                      <Input
                        id="companyDomain"
                        value={formData.companyDomain}
                        onChange={handleInputChange}
                        className="rounded-none border-white h-10 text-sm"
                      />
                    </div>

                    <div className="grid w-full gap-2">
                      <Label htmlFor="email" className="font-bold text-left text-xs uppercase flex items-center gap-0">
                        <span className={errors.email ? "text-red-500" : "text-white"}>*</span><span className="tracking-wider">Email</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-none border-white h-10 text-sm"
                      />
                    </div>

                    <div className="grid w-full gap-2">
                      <Label htmlFor="message" className="font-bold text-left text-xs uppercase flex items-center gap-0">
                        <span className={errors.message ? "text-red-500" : "text-white"}>*</span><span className="tracking-wider">Message</span>
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="rounded-none border-white min-h-[120px] text-sm resize-none"
                      />
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
                  <p className="text-white text-xl text-center font-medium">
                    We have received your message. Serious buyers will be contacted directly.
                  </p>
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
