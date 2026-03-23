import React from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'motion/react';
import Marquee from 'react-fast-marquee';
import { 
  Play, 
  Smartphone, 
  Palette, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Instagram, 
  Youtube, 
  ExternalLink,
  Menu,
  X,
  Mail
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Components ---

const CustomCursor = () => {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);
  const [isClicking, setIsClicking] = React.useState(false);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.group') ||
        target.classList.contains('cursor-pointer');
      
      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const cursorSize = isHovering ? 80 : 20;
  const cursorColor = isHovering ? 'var(--accent)' : 'var(--foreground)';

  return (
    <>
      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-accent z-[9999] pointer-events-none mix-blend-difference"
        animate={{
          x: mousePos.x - 8,
          y: mousePos.y - 8,
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.5 }}
      />
      
      {/* Outer Ring / Trail */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-accent z-[9998] pointer-events-none mix-blend-difference"
        animate={{
          x: mousePos.x - cursorSize / 2,
          y: mousePos.y - cursorSize / 2,
          width: cursorSize,
          height: cursorSize,
          backgroundColor: isHovering ? 'rgba(205, 255, 0, 0.1)' : 'transparent',
          borderColor: cursorColor,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.8 }}
      />
    </>
  );
};

const Reveal = ({ children, className, delay = 0, blur = true }: { children: React.ReactNode, className?: string, delay?: number, blur?: boolean, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95, filter: blur ? 'blur(8px)' : 'none' }}
    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Parallax = ({ children, distance = 50, className }: { children: React.ReactNode, distance?: number, className?: string, key?: React.Key }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

const Counter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: [0.21, 0.47, 0.32, 0.98],
        onUpdate(latest) {
          if (ref.current) {
            ref.current.textContent = Math.round(latest).toString();
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <span className="tabular-nums">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
};

const Noise = () => (
  <svg className="noise-overlay" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <filter id="noiseFilter">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
  </svg>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' | 'ghost' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "h-14 px-8 uppercase font-bold tracking-tighter transition-all flex items-center justify-center gap-2",
        variant === 'primary' && "bg-accent text-accent-foreground",
        variant === 'outline' && "border-2 border-border bg-transparent text-foreground hover:bg-foreground hover:text-background",
        variant === 'ghost' && "bg-transparent text-foreground hover:text-accent",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const SectionHeading = ({ children, subtitle, number }: { children: React.ReactNode, subtitle?: string, number?: string }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const x = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const yNumber = useTransform(scrollYProgress, [0, 1], [-150, 150]);

  return (
    <div ref={ref} className="mb-24 relative">
      {number && (
        <motion.span 
          style={{ y: yNumber }}
          className="absolute -top-20 -left-8 text-[10rem] md:text-[16rem] font-bold text-muted opacity-10 select-none pointer-events-none leading-none z-0"
        >
          {number}
        </motion.span>
      )}
      <motion.div style={{ opacity }} className="relative z-10">
        {subtitle && (
          <Reveal delay={0.1}>
            <p className="text-accent uppercase tracking-[0.4em] text-sm md:text-lg font-bold mb-6">{subtitle}</p>
          </Reveal>
        )}
        <motion.h2 
          style={{ x }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.8] tracking-tighter"
        >
          {children}
        </motion.h2>
      </motion.div>
    </div>
  );
};

const Card = ({ title, description, icon: Icon, index }: { title: string, description: string, icon: any, index: number }) => (
  <Reveal delay={index * 0.1} className="h-full">
    <motion.div 
      whileHover="hover"
      initial="initial"
      className="group relative border-2 border-border p-8 md:p-12 transition-all duration-300 hover:bg-accent hover:border-accent h-full cursor-default"
    >
      <div className="mb-8 text-accent group-hover:text-background transition-colors">
        <Icon size={48} strokeWidth={2.5} />
      </div>
      <motion.h3 
        variants={{
          initial: { x: 0 },
          hover: { x: 20 }
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tighter mb-6 group-hover:text-background transition-colors"
      >
        {title}
      </motion.h3>
      <motion.p 
        variants={{
          initial: { opacity: 0, y: 10 },
          hover: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-muted-foreground text-lg md:text-xl group-hover:text-background/80 transition-colors"
      >
        {description}
      </motion.p>
    </motion.div>
  </Reveal>
);

// --- Sections ---

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b-2 border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[95vw] mx-auto h-20 flex items-center justify-between px-4">
        <div className="text-2xl font-bold tracking-tighter uppercase">
          HM CUTS<span className="text-accent">.</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['About', 'Services', 'Work', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="uppercase font-bold tracking-widest text-sm hover:text-accent transition-colors"
            >
              {item}
            </a>
          ))}
          <Button variant="primary" className="h-10 px-6 text-xs">Hire Me</Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-20 left-0 w-full bg-background border-b-2 border-border p-8 flex flex-col gap-6 md:hidden"
        >
          {['About', 'Services', 'Work', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-4xl font-bold uppercase tracking-tighter hover:text-accent"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
          <Button className="w-full">Hire Me</Button>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden">
      <div className="max-w-[95vw] mx-auto w-full">
        <motion.div 
          style={{ scale, opacity }} 
          initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="inline-block bg-accent text-background px-4 py-1 font-bold uppercase tracking-widest text-sm mb-8">
            EDIT • CREATE • ENGAGE • REPEAT
          </div>
          <h1 className="text-[clamp(3rem,10vw,12rem)] font-bold uppercase leading-[0.85] tracking-tighter mb-12">
            I EDIT VIDEOS THAT <span className="text-accent">GRAB ATTENTION</span> AND KEEP PEOPLE WATCHING
          </h1>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <p className="max-w-xl text-xl md:text-2xl text-muted-foreground leading-tight">
              2+ Years Experience • Reels • YouTube • Cinematic Edits • Motion Graphics. Turning raw footage into powerful visual stories.
            </p>
            <div className="flex gap-4">
              <a href="#work">
                <Button className="h-20 px-12 text-xl">View Projects</Button>
              </a>
              <a href="#contact">
                <Button variant="outline" className="h-20 px-12 text-xl">Let's Talk</Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decorative Text */}
      <div className="absolute bottom-0 left-0 w-full opacity-5 select-none pointer-events-none overflow-hidden whitespace-nowrap">
        <div className="text-[20vw] font-bold uppercase tracking-tighter leading-none translate-y-1/4">
          STORIES TELLING
        </div>
      </div>
    </section>
  );
};

const MarqueeBanner = () => (
  <div className="border-y-2 border-border py-8 bg-accent text-background overflow-hidden">
    <Marquee speed={100} gradient={false}>
      {[
        "VIDEO EDITOR", "FREELANCER", "SHORT & LONG CONTENT", "INSTA REELS", "YOUTUBE", "MOTION GRAPHICS"
      ].map((text, i) => (
        <div key={i} className="flex items-center mx-8">
          <span className="text-6xl md:text-8xl font-bold uppercase tracking-tighter">{text}</span>
          <Zap size={48} className="ml-12 fill-current" />
        </div>
      ))}
    </Marquee>
  </div>
);

const About = () => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const yImg = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yText = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section id="about" ref={ref} className="py-32 max-w-[95vw] mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div style={{ y: yImg }} className="relative">
          <Reveal className="relative">
            <div className="aspect-[4/5] bg-muted border-2 border-border overflow-hidden">
              <img 
                src="https://i.pinimg.com/1200x/2c/70/e0/2c70e094521c0500565bedfb88a03fa3.jpg" 
                alt="Video Editor Workspace" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent flex items-center justify-center p-6 text-background text-center font-bold uppercase tracking-tighter leading-none text-2xl">
              2 YEARS EXP.
            </div>
          </Reveal>
        </motion.div>
        <motion.div style={{ y: yText }}>
          <SectionHeading subtitle="The Editor" number="01">
            I DON'T JUST CUT VIDEOS — I <span className="text-accent">CRAFT CONTENT</span>
          </SectionHeading>
          <div className="space-y-8 text-xl md:text-2xl text-muted-foreground leading-relaxed">
            <Reveal delay={0.2}>
              <p>
                I’m HEMANATH, I'm a freelance video editor with 2 years of experience helping creators and brands turn raw footage into powerful visual stories.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p>
                I craft content that grabs attention, builds emotion, and keeps viewers watching till the end. My editing style focuses on clean storytelling, beat sync, and attractive.
              </p>
            </Reveal>
            <div className="grid grid-cols-2 gap-8 pt-8">
              {[
                { label: "Storytelling", value: "Clean" },
                { label: "Transitions", value: "Smooth" },
                { label: "Color", value: "Cinematic" },
                { label: "Retention", value: "High" },
              ].map((stat, i) => (
                <Reveal key={i} delay={0.4 + (i * 0.1)} className="border-l-4 border-accent pl-6">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold uppercase text-foreground">{stat.value}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => (
  <section id="services" className="py-32 bg-muted/30">
    <div className="max-w-[95vw] mx-auto">
      <SectionHeading subtitle="What I Do" number="02">
        PREMIUM <span className="text-accent">SERVICES</span>
      </SectionHeading>
      <div className="grid md:grid-cols-2 gap-px bg-border border-2 border-border">
        <Card 
          title="Video Editing" 
          description="From raw clips to final output — I create smooth, engaging, and professional edits tailored to your content style."
          icon={Play}
          index={0}
        />
        <Card 
          title="Short Form" 
          description="Reels, TikTok, Shorts — optimized for viral reach with fast pacing and modern editing trends."
          icon={Smartphone}
          index={1}
        />
        <Card 
          title="Long Form" 
          description="I can edit a long form youtube contents with Story telling way."
          icon={Palette}
          index={2}
        />
        <Card 
          title="Motion Graphics" 
          description="Dynamic titles, captions, and effects using After Effects to enhance Video."
          icon={Zap}
          index={3}
        />
      </div>
    </div>
  </section>
);

const Work = () => (
  <section id="work" className="py-32 max-w-[95vw] mx-auto">
    <SectionHeading subtitle="Selected Work" number="03">
      WATCH THE <span className="text-accent">RESULTS</span>
    </SectionHeading>
    <div className="grid md:grid-cols-2 gap-8 md:gap-16">
      {[
        { 
          title: "Cinematic Edit", 
          category: "Storytelling", 
          img: "https://i.pinimg.com/736x/5c/7e/37/5c7e37fd663348db09ffc7c83f89cd50.jpg",
          desc: "High-quality storytelling with smooth transitions and color grading.",
          speed: 40,
          link: "https://drive.google.com/file/d/1hANaFYfQcSEcerx-062vOqhOyDleAb_f/view?usp=drivesdk"
        },
        { 
          title: "Instagram Reels", 
          category: "Premiere pro", 
          img: "https://i.pinimg.com/736x/40/fa/8c/40fa8c0499a92c7135ea78e3ba5a537f.jpg",
          desc: "Fast-paced edits designed for engagement and reach.",
          speed: -40,
          link: "https://drive.google.com/file/d/1kvtvMwe7T0rW7SCTTUVs88jQmwMAbCg-/view?usp=drivesdk"
        },
        { 
          title: "YouTube Videos", 
          category: "Content Creation", 
          img: "https://i.pinimg.com/1200x/df/03/93/df0393965c6fdce90e8843efd9a9bc69.jpg",
          desc: "It's a Foreign client. Structured edits with subtitles, pacing, and viewer retention focus.",
          speed: 60,
          link: "https://drive.google.com/file/d/1oeH-mLNO6Xor__1wtE-a9AkFT6aOhoog/view?usp=drivesdk"
        },
        { 
          title: "Glimpse Videos", 
          category: "Brand", 
          img: "https://i.pinimg.com/736x/40/1c/8d/401c8d782dba8e44396608b4e0fd333a.jpg",
          desc: "Brand-focused edits with motion graphics and clean visuals.",
          speed: -60,
          link: "https://drive.google.com/file/d/145eMUJsaUjPkW57WZLs0pCT-nsbIpLF6/view?usp=drivesdk"
        },
      ].map((project, i) => (
        <Parallax key={i} distance={project.speed} className="h-full">
          <Reveal delay={i * 0.1}>
            <motion.a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -10 }}
              className="group border-2 border-border overflow-hidden bg-background block"
            >
              <div className="aspect-video relative overflow-hidden border-b-2 border-border">
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-accent/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play size={64} className="text-background fill-current" />
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-accent uppercase tracking-widest text-sm font-bold mb-2">{project.category}</p>
                    <h3 className="text-3xl font-bold uppercase tracking-tighter">{project.title}</h3>
                  </div>
                  <ExternalLink className="text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <p className="text-muted-foreground text-lg">{project.desc}</p>
              </div>
            </motion.a>
          </Reveal>
        </Parallax>
      ))}
    </div>
    <Reveal className="mt-24 flex justify-center">
      <a href="https://drive.google.com/drive/folders/1WAm2of-H134J_CeMxuddUR37TzFIy2rA" target="_blank" rel="noopener noreferrer">
      <Button variant="outline" className="h-20 px-12 text-xl" >View All Work</Button> </a>
    </Reveal>
  </section>
);

const Stats = () => (
  <section className="py-32 bg-accent text-background overflow-hidden">
    <div className="max-w-[95vw] mx-auto grid md:grid-cols-4 gap-12 text-center">
      {[
        { value: 2, suffix: "+", label: "Years Exp" },
        { value: 30, suffix: "+", label: "Videos Edited" },
        { value: 100, suffix: "%", label: "Satisfaction" },
        { value: 6, suffix: "+", label: "Brands" },
      ].map((stat, i) => (
        <Reveal key={i} delay={i * 0.1}>
          <div className="text-7xl md:text-9xl font-bold tracking-tighter leading-none mb-4">
            <Counter value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-xl uppercase font-bold tracking-widest">{stat.label}</div>
        </Reveal>
      ))}
    </div>
  </section>
);

const Tools = () => (
  <section className="py-20 border-b-2 border-border">
    <div className="max-w-[95vw] mx-auto">
      <Reveal>
        <p className="text-center uppercase tracking-[0.5em] text-muted-foreground mb-12">Industry Standard Tools</p>
      </Reveal>
      <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all">
        {["Adobe Premiere Pro", "Adobe After Effects", "CapCut", "Adobe Photoshop"].map((tool, i) => (
          <Reveal key={tool} delay={i * 0.1}>
            <span className="text-2xl md:text-4xl font-bold uppercase tracking-tighter">{tool}</span>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const WhyMe = () => (
  <section className="py-32 max-w-[95vw] mx-auto">
    <SectionHeading subtitle="Why Me" number="04">
      THE <span className="text-accent">ADVANTAGE</span>
    </SectionHeading>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { title: "Fast Delivery", desc: "Quick turnaround without compromising on the cinematic quality." },
        { title: "Modern Style", desc: "Edits that match current social media trends and high-end aesthetics." },
        { title: "Clear Comms", desc: "Transparent and constant communication throughout the project lifecycle." },
        { title: "Detail Oriented", desc: "Every frame is polished to perfection with precision and care." }
      ].map((item, i) => (
        <Reveal key={i} delay={i * 0.1} className="h-full">
          <motion.div 
            whileHover="hover"
            initial="initial"
            className="p-8 border-2 border-border flex flex-col gap-6 h-full bg-background hover:bg-accent hover:border-accent transition-colors duration-300 group cursor-default"
          >
            <CheckCircle2 size={40} className="text-accent group-hover:text-background transition-colors" />
            <div>
              <motion.h3 
                variants={{
                  initial: { x: 0 },
                  hover: { x: 15 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-3xl font-bold uppercase tracking-tighter leading-tight group-hover:text-background transition-colors mb-4"
              >
                {item.title}
              </motion.h3>
              <motion.p 
                variants={{
                  initial: { opacity: 0, y: 10 },
                  hover: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-lg text-muted-foreground group-hover:text-background/80 transition-colors"
              >
                {item.desc}
              </motion.p>
            </div>
          </motion.div>
        </Reveal>
      ))}
    </div>
  </section>
);

const ContactForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    work: '',
    duration: '',
    place: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Using formsubmit.co AJAX API for a real submission experience
      const response = await fetch("https://formsubmit.co/ajax/hemanathtech@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.name,
            work: formData.work,
            duration: formData.duration,
            place: formData.place,
            _subject: `New Work Request from ${formData.name}`
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', work: '', duration: '', place: '' });
        setTimeout(() => setSubmitted(false), 5000); // Reset success message after 5s
      } else {
        throw new Error("AJAX submission failed");
      }
    } catch (error) {
      // Fallback to mailto if AJAX fails or is blocked
      const subject = `Work Request from ${formData.name}`;
      const body = `Name: ${formData.name}%0D%0AWork: ${formData.work}%0D%0ADuration: ${formData.duration}%0D%0APlace: ${formData.place}`;
      window.open(`mailto:hemanathtech@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`, '_blank');
      
      setSubmitted(true);
      setFormData({ name: '', work: '', duration: '', place: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 border-2 border-border bg-background relative z-20 text-left">
      <div className="mb-12 text-center">
        <h3 className="text-4xl font-bold uppercase tracking-tighter mb-4">Send a Request</h3>
        <p className="text-muted-foreground uppercase tracking-widest text-sm">Fill the form below or email me at <span className="text-accent font-bold">hemanathtech@gmail.com</span></p>
      </div>
      
      {submitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-20 text-center space-y-6"
        >
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} className="text-background" />
          </div>
          <h4 className="text-4xl font-bold uppercase tracking-tighter">Request Sent!</h4>
          <p className="text-muted-foreground uppercase tracking-widest">I'll get back to you as soon as possible.</p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8">Send Another Request</Button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Name of Client</label>
              <input 
                required
                type="text" 
                placeholder="YOUR FULL NAME"
                className="w-full bg-background border-2 border-border p-5 focus:border-accent outline-none transition-all uppercase font-bold text-lg placeholder:opacity-30"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Work</label>
              <input 
                required
                type="text" 
                placeholder="TYPE OF PROJECT"
                className="w-full bg-background border-2 border-border p-5 focus:border-accent outline-none transition-all uppercase font-bold text-lg placeholder:opacity-30"
                value={formData.work}
                onChange={(e) => setFormData({...formData, work: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Duration</label>
              <input 
                required
                type="text" 
                placeholder="ESTIMATED TIME"
                className="w-full bg-background border-2 border-border p-5 focus:border-accent outline-none transition-all uppercase font-bold text-lg placeholder:opacity-30"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Place</label>
              <input 
                required
                type="text" 
                placeholder="YOUR LOCATION"
                className="w-full bg-background border-2 border-border p-5 focus:border-accent outline-none transition-all uppercase font-bold text-lg placeholder:opacity-30"
                value={formData.place}
                onChange={(e) => setFormData({...formData, place: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="h-24 px-12 text-2xl w-full group"
            disabled={isSubmitting}
          >
            {isSubmitting ? "SENDING..." : "SUBMIT WORK REQUEST"}
            {!isSubmitting && <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform" />}
          </Button>
        </form>
      )}
    </div>
  );
};

const CTA = () => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const xBg = useTransform(scrollYProgress, [0, 1], [-200, 200]);

  return (
    <section id="contact" ref={ref} className="py-32 relative overflow-hidden">
      <div className="max-w-[95vw] mx-auto text-center relative z-10">
        <Reveal>
          <h2 className="text-[clamp(3rem,10vw,10rem)] font-bold uppercase leading-[0.85] tracking-tighter mb-12">
            READY TO <span className="text-accent">LEVEL UP</span> YOUR CONTENT?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="max-w-3xl mx-auto text-2xl md:text-3xl text-muted-foreground mb-16">
            Let’s create videos that people don’t just watch — but remember.
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <div className="grid md:grid-cols-3 gap-8 mb-20 text-left">
            {[
              { title: "Direct Access", desc: "Skip the agencies. Work directly with the lead editor for faster results." },
              { title: "Global Sync", desc: "Operating across all time zones to ensure your deadlines are always met." },
              { title: "Custom Scale", desc: "From solo creators to global brands, we scale our process to your needs." }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                whileHover="hover"
                initial="initial"
                className="p-8 border-2 border-border bg-background hover:bg-accent hover:border-accent transition-colors duration-300 group cursor-default"
              >
                <motion.h4 
                  variants={{
                    initial: { x: 0 },
                    hover: { x: 15 }
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-2xl font-bold uppercase tracking-tighter mb-4 group-hover:text-background transition-colors"
                >
                  {benefit.title}
                </motion.h4>
                <motion.p 
                  variants={{
                    initial: { opacity: 0 },
                    hover: { opacity: 1 }
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-muted-foreground group-hover:text-background/80 transition-colors"
                >
                  {benefit.desc}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <ContactForm />
        </Reveal>

        <Reveal delay={0.6}>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <a href="#" className="w-full md:w-auto">
              <Button className="h-24 px-16 text-2xl w-full">Start a Project</Button>
            </a>
            <div className="flex gap-8">
              <a href="https://www.instagram.com/hemsz_21?igsh=MXhvajJ0YnVzOXNhaQ==" className="text-muted-foreground hover:text-accent transition-colors"><Instagram size={48} /></a>
              
            </div>
          </div>
        </Reveal>
      </div>
      
      {/* Background Decorative Text */}
      <motion.div 
        style={{ x: xBg }}
        className="absolute top-1/2 left-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none w-full text-center whitespace-nowrap"
      >
        <div className="text-[30vw] font-bold uppercase tracking-tighter">CONTACT CONTACT CONTACT</div>
      </motion.div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 border-t-2 border-border">
    <div className="max-w-[95vw] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-xl font-bold tracking-tighter uppercase">
        HM CUTS<span className="text-accent">.</span>
      </div>
      <div className="flex gap-8 uppercase font-bold tracking-widest text-xs text-muted-foreground">
        <a href="#" className="hover:text-accent">Privacy</a>
        <a href="#" className="hover:text-accent">Terms</a>
        <span>© 2026 HM CUTS</span>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  return (
    <div className="relative cursor-none">
      <CustomCursor />
      <Noise />
      <Navbar />
      <main>
        <Hero />
        <MarqueeBanner />
        <About />
        <Services />
        <Stats />
        <Work />
        <WhyMe />
        <Tools />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
