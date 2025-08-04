"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  MapPin,
  Calendar,
  Smile,
  Menu,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PersonalFriendshipTribute() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [playingVideo, setPlayingVideo] = useState<number | null>(null)
  const [confetti, setConfetti] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [videoMuted, setVideoMuted] = useState(true)
  const heroRef = useRef<HTMLElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null)

  // 🎯 CUSTOMIZE FOR EACH FRIEND - Replace with their name and details
  const friendName = "Alex" // Change this for each friend
  const friendNickname = "The Adventure Buddy" // Their special nickname
  const meetingStory = "We met in freshman orientation and instantly clicked!" // How you met
  const favoriteMemory = "That epic road trip to the mountains" // Your favorite shared memory

  // 🎯 CUSTOMIZE MEMORIES - Replace with actual photos/videos and captions for each friend
  const sharedMemories = [
    {
      type: "video",
      src: "/placeholder.svg?height=400&width=300&text=First+Day+Video",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      caption: "First day we met - instant connection! 🌟",
      location: "Campus Cafeteria",
      date: "September 2020",
    },
    {
      type: "image",
      src: "/placeholder.svg?height=400&width=300",
      caption: "Late night study sessions that turned into deep talks ☕",
      location: "Library",
      date: "October 2020",
    },
    {
      type: "video",
      src: "/placeholder.svg?height=400&width=300&text=Mountain+Adventure",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      caption: "That amazing weekend getaway! 🏔️",
      location: "Mountain Resort",
      date: "Spring 2021",
    },
    {
      type: "video",
      src: "/placeholder.svg?height=400&width=300&text=Birthday+Celebration",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      caption: "Celebrating your birthday in style! 🎂",
      location: "Downtown",
      date: "Your Birthday 2021",
    },
    {
      type: "image",
      src: "/placeholder.svg?height=400&width=300",
      caption: "Graduation day - so proud of you! 🎓",
      location: "University Auditorium",
      date: "May 2024",
    },
    {
      type: "video",
      src: "/placeholder.svg?height=400&width=300&text=Random+Fun+Times",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      caption: "Random fun times that made us laugh! 😂",
      location: "Everywhere",
      date: "All the time",
    },
  ]

  // 🎯 VIDEO TESTIMONIALS - Personal video messages
  const videoTestimonials = [
    {
      name: "Sarah",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "/placeholder.svg?height=200&width=200&text=Sarah",
      message: "Alex, you're the most genuine person I know!",
      duration: "0:45",
    },
    {
      name: "Mike",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "/placeholder.svg?height=200&width=200&text=Mike",
      message: "Remember all those crazy adventures we had?",
      duration: "1:12",
    },
    {
      name: "Emma",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "/placeholder.svg?height=200&width=200&text=Emma",
      message: "You always knew how to make us smile!",
      duration: "0:38",
    },
    {
      name: "Jordan",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail: "/placeholder.svg?height=200&width=200&text=Jordan",
      message: "College wouldn't have been the same without you!",
      duration: "1:05",
    },
  ]

  // 🎯 CUSTOMIZE QUALITIES - What makes this friend special
  const friendQualities = [
    {
      title: "The Loyal Heart",
      description: "Always there when I need someone to talk to",
      icon: "❤️",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      memory: "Remember when you stayed up all night just to listen to me vent about that project?",
    },
    {
      title: "The Adventure Seeker",
      description: "Turns ordinary days into extraordinary memories",
      icon: "🌟",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      memory: "That spontaneous trip to the beach at 2 AM was pure magic!",
    },
    {
      title: "The Wisdom Keeper",
      description: "Always knows exactly what to say",
      icon: "🧠",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      memory: "Your advice about following my dreams changed everything for me",
    },
    {
      title: "The Joy Bringer",
      description: "Makes everyone around them smile",
      icon: "😊",
      videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      memory: "Your laugh is literally contagious - it brightens my worst days",
    },
  ]

  // Navigation sections for mobile menu
  const navigationSections = [
    { id: "hero", label: "Home", icon: "🏠" },
    { id: "story", label: "Our Story", icon: "📖" },
    { id: "memories", label: "Memories", icon: "📸" },
    { id: "testimonials", label: "Video Messages", icon: "🎥" },
    { id: "special", label: "Special", icon: "✨" },
  ]

  // Touch gesture handling for carousel
  const minSwipeDistance = 50

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sharedMemories.length)
      }, 4000) // Change slide every 4 seconds
    } else {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current)
      }
    }

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current)
      }
    }
  }, [isAutoPlaying, sharedMemories.length])

  // Pause auto-slide on hover/interaction
  const pauseAutoSlide = () => setIsAutoPlaying(false)
  const resumeAutoSlide = () => setIsAutoPlaying(true)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }, [touchStart, touchEnd])

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset
        const parallax = heroRef.current.querySelector(".parallax-bg") as HTMLElement
        if (parallax) {
          parallax.style.transform = `translateY(${scrolled * 0.3}px)`
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const triggerConfetti = () => {
    setConfetti(true)
    setTimeout(() => setConfetti(false), 3000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sharedMemories.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000) // Resume after 8 seconds
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sharedMemories.length) % sharedMemories.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000) // Resume after 8 seconds
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  const toggleVideo = (index: number) => {
    const video = videoRefs.current[index]
    if (video) {
      if (playingVideo === index) {
        video.pause()
        setPlayingVideo(null)
      } else {
        // Pause all other videos
        videoRefs.current.forEach((v, i) => {
          if (v && i !== index) {
            v.pause()
          }
        })
        video.play()
        setPlayingVideo(index)
      }
    }
  }

  const getCarouselItemClass = (index: number) => {
    const diff = index - currentSlide
    const total = sharedMemories.length

    // Handle wrap around
    const normalizedDiff = diff > total / 2 ? diff - total : diff < -total / 2 ? diff + total : diff

    if (normalizedDiff === 0) return "scale-110 z-20 opacity-100" // Current
    if (Math.abs(normalizedDiff) === 1) return "scale-90 z-10 opacity-70" // Adjacent
    return "scale-75 z-0 opacity-40" // Others
  }

  const getCarouselTransform = (index: number) => {
    const diff = index - currentSlide
    const total = sharedMemories.length

    // Handle wrap around
    const normalizedDiff = diff > total / 2 ? diff - total : diff < -total / 2 ? diff + total : diff

    return `translateX(${normalizedDiff * 280}px)`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 font-mono">
      {/* Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800 font-handwritten">For {friendName}</h1>
          <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
            <div className="px-4 py-2">
              {navigationSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="flex items-center space-x-3 w-full px-3 py-3 text-left hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="text-gray-700 font-medium">{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Confetti Animation */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {["✨", "🌟", "💫", "⭐", "💖", "🎉"][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}

      {/* Hero Section with Background Video */}
      <section
        id="hero"
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0"
      >
        <div className="parallax-bg absolute inset-0 bg-gradient-to-r from-amber-200/40 via-rose-200/40 to-sky-200/40"></div>
        <video
          autoPlay
          muted={videoMuted}
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            type="video/mp4"
          />
        </video>

        {/* Video Controls */}
        <div className="absolute top-20 md:top-8 right-4 z-30 flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVideoMuted(!videoMuted)}
            className="bg-white/80 hover:bg-white shadow-lg rounded-full p-2"
          >
            {videoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="relative z-10 text-center px-4 animate-fade-in max-w-4xl">
          <div className="mb-6 md:mb-8">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 rounded-full bg-gradient-to-br from-amber-300 to-rose-300 flex items-center justify-center text-2xl md:text-4xl shadow-2xl">
              👤
            </div>
          </div>
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl">
            Hey {friendName}!
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-sky-300 animate-pulse">
              This Is For You
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90 mb-6 md:mb-8 font-handwritten px-4 drop-shadow-lg">
            A video-filled journey celebrating our amazing friendship 💝
          </p>
          <div className="flex justify-center space-x-4 md:space-x-6 mt-6 md:mt-8">
            <Heart className="text-rose-300 animate-bounce w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
            <Star className="text-amber-300 animate-spin w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
            <Smile className="text-sky-300 animate-pulse w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
          </div>
        </div>
      </section>

      {/* Our Story Section with Video */}
      <section id="story" className="py-12 md:py-20 px-4 bg-gradient-to-r from-amber-50 to-rose-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-gray-800 font-handwritten text-center">
            Our Story 📖
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-amber-400 to-rose-500 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <Card className="p-6 md:p-8 bg-white/80 backdrop-blur-sm shadow-xl border-2 border-amber-200">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-4 md:mb-6">{meetingStory}</p>
              <p className="text-lg md:text-xl font-semibold text-gray-800 font-handwritten">"{favoriteMemory}"</p>
              <p className="text-xs md:text-sm text-gray-500 mt-2">- My favorite memory with you</p>
            </Card>

            <div className="relative">
              <video
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-2xl"
                controls
                poster="/placeholder.svg?height=320&width=480&text=Our+Story+Video"
              >
                <source
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Memory Lane Carousel */}
      <section id="memories" className="py-12 md:py-20 px-4 bg-gradient-to-r from-rose-50 to-sky-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-gray-800 font-handwritten">
            Memory Lane 📸
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-rose-400 to-sky-500 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </h2>

          {/* Auto-slide indicator */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <div
                className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
              ></div>
              <span className="text-sm text-gray-600">{isAutoPlaying ? "Auto-playing" : "Paused"}</span>
            </div>
          </div>

          {/* Desktop Carousel */}
          <div className="hidden md:block relative">
            <div
              className="flex justify-center items-center relative"
              style={{ height: "500px" }} // Fixed height to prevent trimming
              onMouseEnter={pauseAutoSlide}
              onMouseLeave={resumeAutoSlide}
            >
              <div className="relative w-full max-w-5xl overflow-visible">
                {" "}
                {/* Changed to overflow-visible */}
                {sharedMemories.map((memory, index) => (
                  <div
                    key={index}
                    className={`absolute transition-all duration-700 ease-in-out ${getCarouselItemClass(index)}`}
                    style={{
                      transform: getCarouselTransform(index),
                      left: "50%",
                      top: "50%",
                      marginLeft: "-128px", // Half of card width (256px / 2)
                      marginTop: "-200px", // Half of card height (400px / 2)
                    }}
                  >
                    <Card className="w-64 bg-white border-4 border-dashed border-sky-300 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                      <div className="aspect-[3/4] relative overflow-hidden">
                        {memory.type === "video" ? (
                          <div className="relative">
                            <video
                              className="w-full h-full object-cover"
                              poster={memory.src}
                              muted
                              loop
                              autoPlay={index === currentSlide}
                            >
                              <source src={memory.videoSrc} type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <div className="bg-white/90 rounded-full p-3 shadow-lg">
                                <Play className="h-6 w-6 text-gray-800" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={memory.src || "/placeholder.svg"}
                            alt={memory.caption}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-lg">
                          <Heart className="h-4 w-4 text-rose-400" />
                        </div>
                        <div className="absolute top-3 left-3 bg-white/90 rounded-lg px-2 py-1 shadow-lg">
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{memory.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-rose-100 to-sky-100">
                        <p className="text-sm font-semibold text-gray-800 text-center mb-2">{memory.caption}</p>
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{memory.location}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              onClick={prevSlide}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full w-12 h-12 z-30"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              onClick={nextSlide}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full w-12 h-12 z-30"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Play/Pause Button */}
            <Button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              variant="ghost"
              size="icon"
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full w-12 h-12 z-30"
            >
              {isAutoPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div
              className="relative overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {sharedMemories.map((memory, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="relative overflow-hidden shadow-2xl bg-white border-4 border-dashed border-sky-300 mx-auto max-w-sm">
                      <div className="aspect-[3/4] relative">
                        {memory.type === "video" ? (
                          <div className="relative">
                            <video className="w-full h-full object-cover" poster={memory.src} controls playsInline>
                              <source src={memory.videoSrc} type="video/mp4" />
                            </video>
                          </div>
                        ) : (
                          <img
                            src={memory.src || "/placeholder.svg"}
                            alt={memory.caption}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-lg">
                          <Heart className="h-4 w-4 text-rose-400" />
                        </div>
                        <div className="absolute top-3 left-3 bg-white/90 rounded-lg px-2 py-1 shadow-lg">
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{memory.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-rose-100 to-sky-100">
                        <p className="text-sm font-semibold text-gray-800 text-center mb-2">{memory.caption}</p>
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{memory.location}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Auto-slide Control */}
            <div className="text-center mt-4">
              <Button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                variant="ghost"
                size="sm"
                className="bg-white/80 hover:bg-white shadow-lg rounded-full px-4 py-2"
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Auto-play
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Auto-play
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex justify-center mt-8">
            <div className="w-64 bg-gray-200 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-sky-500 transition-all duration-100 ease-linear"
                style={{
                  width: `${((currentSlide + 1) / sharedMemories.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {sharedMemories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index)
                  setIsAutoPlaying(false)
                  setTimeout(() => setIsAutoPlaying(true), 8000)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 touch-manipulation ${
                  index === currentSlide ? "bg-sky-500 scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section id="testimonials" className="py-12 md:py-20 px-4 bg-gradient-to-r from-sky-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-gray-800 font-handwritten">
            Video Messages From Friends 🎥
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-sky-400 to-purple-500 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {videoTestimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl bg-white border-2 border-purple-200 hover:border-purple-400 cursor-pointer group"
                onClick={() => toggleVideo(index)}
              >
                <div className="aspect-square relative">
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    className="w-full h-full object-cover"
                    poster={testimonial.thumbnail}
                    muted
                    playsInline
                  >
                    <source src={testimonial.videoSrc} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {playingVideo === index ? (
                      <Pause className="h-12 w-12 text-white drop-shadow-lg" />
                    ) : (
                      <Play className="h-12 w-12 text-white drop-shadow-lg" />
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {testimonial.duration}
                  </div>
                  {playingVideo === index && (
                    <div className="absolute inset-0 border-4 border-green-400 animate-pulse"></div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{testimonial.name}</h3>
                  <p className="text-gray-600 italic text-sm">"{testimonial.message}"</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes You Special Section with Videos */}
      <section id="special" className="py-12 md:py-20 px-4 bg-gradient-to-r from-purple-50 to-amber-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16 text-gray-800 font-handwritten">
            What Makes You Special ✨
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-purple-400 to-amber-500 mx-auto mt-3 md:mt-4 rounded-full"></div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 md:px-0">
            {friendQualities.map((quality, index) => (
              <Card
                key={index}
                className="overflow-hidden bg-white/80 backdrop-blur-sm shadow-xl border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 cursor-pointer group touch-manipulation active:scale-95"
                onClick={triggerConfetti}
              >
                <div className="aspect-video relative">
                  <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                    <source src={quality.videoSrc} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-2xl mb-2">{quality.icon}</div>
                    <h3 className="text-lg font-bold font-handwritten">{quality.title}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm md:text-base text-gray-600 mb-3">{quality.description}</p>
                  <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-3 rounded-lg">
                    <p className="text-xs md:text-sm text-gray-700 italic">"{quality.memory}"</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 font-handwritten">
            Until We Meet Again, {friendName}... 🌟
          </h3>
          <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 leading-relaxed px-4">
            No matter where life takes us, you'll always have a special place in my heart.
            <br />
            Thank you for being such an incredible friend! 💫
          </p>
          <div className="flex justify-center space-x-4 md:space-x-6 text-xl md:text-2xl mb-6 md:mb-8">
            <span className="animate-bounce">💝</span>
            <span className="animate-pulse">🌈</span>
            <span className="animate-bounce" style={{ animationDelay: "0.5s" }}>
              ✨
            </span>
            <span className="animate-pulse" style={{ animationDelay: "1s" }}>
              🎉
            </span>
            <span className="animate-bounce" style={{ animationDelay: "1.5s" }}>
              💫
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-400 px-4">
            Made with 💖 for an amazing friend | Keep being awesome, {friendName}!
          </p>
        </div>
      </footer>
    </div>
  )
}
