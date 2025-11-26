"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"

interface Testimonial {
  image: string
  name: string
  username: string
  text: string
  social: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  className?: string
  title?: string
  description?: string
  maxDisplayed?: number
}

export function Testimonials({
  testimonials,
  className,
  title = "Read what people are saying",
  description = "Dummy feedback from virtual customers using our component library.",
  maxDisplayed = 6,
}: TestimonialsProps) {
  const [showAll, setShowAll] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const openInNewTab = (url: string) => {
    window.open(url, "_blank")?.focus()
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <div className={className}>
      <motion.div 
        className="flex flex-col items-center justify-center pt-5"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col gap-4 mb-10">
          <h2 className="text-center text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-white text-balance">{title}</h2>
          <p className="text-center text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            {description.split("<br />").map((line, i) => (
              <span key={i}>
                {line}
                {i !== description.split("<br />").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </motion.div>

      <div className="relative">
        <motion.div
          className={cn(
            "flex justify-center items-stretch gap-5 flex-wrap",
            !showAll &&
              testimonials.length > maxDisplayed &&
              "max-h-[720px] overflow-hidden",
          )}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials
            .slice(0, showAll ? undefined : maxDisplayed)
            .map((testimonial, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card
                  className="w-80 h-auto p-5 relative bg-card/50 border-white/[0.08] backdrop-blur-sm hover:border-white/[0.15] transition-all duration-300"
                >
                  <div className="flex items-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full object-cover w-12 h-12"
                    />
                    <div className="flex flex-col pl-4">
                      <span className="font-semibold text-sm text-white">
                        {testimonial.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {testimonial.username}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 mb-4">
                    <p className="text-foreground/80 text-sm font-light leading-relaxed">
                      {testimonial.text}
                    </p>
                  </div>
                  <button
                    onClick={() => openInNewTab(testimonial.social)}
                    className="absolute top-4 right-4 hover:opacity-80 transition-opacity text-white/50 hover:text-white"
                  >
                  <Icons.twitter className="h-4 w-4" aria-hidden="true" />
                </button>
              </Card>
              </motion.div>
            ))}
        </motion.div>

        {testimonials.length > maxDisplayed && !showAll && (
          <>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background via-background/80 to-transparent" />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <Button 
                variant="secondary" 
                onClick={() => setShowAll(true)}
                className="bg-white/10 border border-white/[0.1] text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Load More
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export type { Testimonial }
