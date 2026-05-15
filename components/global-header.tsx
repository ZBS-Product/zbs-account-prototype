"use client"

import { useEffect, useState, useCallback } from "react"
import { Sun, Moon, RefreshCw, Smartphone, Search, Layers } from "lucide-react"
import { openPhone } from "@/components/global-phone-panel"
import { openNavSearch } from "@/components/global-nav-search"
import GlobalNavSearch from "@/components/global-nav-search"
import { openDesignPanel } from "@/components/global-design-panel"
import GlobalDesignPanel from "@/components/global-design-panel"

type Quote = { text: string; author: string }

const QUOTES: Quote[] = [
  // Product Strategy
  { text: "It doesn't matter how good your engineering team is if they are not given something worthwhile to build.", author: "Marty Cagan" },
  { text: "The most important thing is to not build it wrong, but to build the right thing.", author: "Marty Cagan" },
  { text: "Fall in love with the problem, not the solution.", author: "Uri Levine" },
  { text: "Strategy is not about being better at what you do. It's about being different in ways that matter.", author: "Roger Martin" },
  { text: "Good strategy requires leaders who are willing and able to say no to a wide variety of actions and interests.", author: "Richard Rumelt" },
  { text: "A goal without a strategy is just a wish.", author: "Antoine de Saint-Exupéry" },
  { text: "Strategy is about making choices, trade-offs; it's about deliberately choosing to be different.", author: "Michael Porter" },
  { text: "The essence of strategy is choosing what not to do.", author: "Michael Porter" },
  { text: "You can't innovate on products without first innovating the way you build them.", author: "Alex Osterwalder" },
  { text: "Vision without execution is hallucination.", author: "Thomas Edison" },
  // User Research & Customer Empathy
  { text: "Get out of the building.", author: "Steve Blank" },
  { text: "Your most unhappy customers are your greatest source of learning.", author: "Bill Gates" },
  { text: "We don't have a better product, we have a better understanding of our customers.", author: "Jeff Bezos" },
  { text: "The customer is not always right, but the customer always has a reason.", author: "Rob Fitzpatrick" },
  { text: "The Mom Test: Talk about their life instead of your idea.", author: "Rob Fitzpatrick" },
  { text: "The goal of customer development is not to validate your hypotheses, it is to invalidate them.", author: "Eric Ries" },
  { text: "Observation is the single most powerful research technique available to a product manager.", author: "Marty Cagan" },
  { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
  { text: "If you think good design is expensive, you should look at the cost of bad design.", author: "Ralf Speth" },
  { text: "Empathy is the most important skill you can practice.", author: "Teresa Torres" },
  { text: "Customers don't buy products; they hire them to do a job.", author: "Clayton Christensen" },
  { text: "Stop asking people what they want. Watch what they do.", author: "Michael Lopp" },
  { text: "Users are not designers, and designers are not users.", author: "Jakob Nielsen" },
  { text: "The best products don't focus on features, they focus on clarity.", author: "Jon Bell" },
  // Shipping & Iteration
  { text: "If you are not embarrassed by the first version of your product, you've launched too late.", author: "Reid Hoffman" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Make something people want.", author: "Paul Graham" },
  { text: "Ship early and ship often.", author: "Eric Ries" },
  { text: "The biggest risk is not taking any risk.", author: "Mark Zuckerberg" },
  { text: "Real artists ship.", author: "Steve Jobs" },
  { text: "Speed of iteration beats quality of iteration.", author: "Marc Andreessen" },
  { text: "Shipping is a feature. A really important feature. Your product must have it.", author: "Joel Spolsky" },
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "An MVP is not about shipping something broken; it's about shipping something you can learn from.", author: "Eric Ries" },
  { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
  // Lean Startup & Validation
  { text: "The only way to win is to learn faster than anyone else.", author: "Eric Ries" },
  { text: "Validated learning is the unit of progress for startups.", author: "Eric Ries" },
  { text: "Build-Measure-Learn. Turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere.", author: "Eric Ries" },
  { text: "Startups that succeed are those that manage to iterate enough times before running out of resources.", author: "Eric Ries" },
  { text: "The goal of product discovery is to quickly separate the good ideas from the bad.", author: "Marty Cagan" },
  { text: "Every feature is a hypothesis.", author: "Itamar Gilad" },
  { text: "Test your riskiest assumptions first.", author: "Jeff Gothelf" },
  { text: "Fail fast, learn fast.", author: "Eric Ries" },
  // Prioritization
  { text: "The most important decisions are not about what to build, but what not to build.", author: "Marty Cagan" },
  { text: "You can do anything, but not everything.", author: "David Allen" },
  { text: "What's the simplest thing that could possibly work?", author: "Ward Cunningham" },
  { text: "Prioritization is not a one-time event. It's a continuous process.", author: "Teresa Torres" },
  { text: "Saying no is more important than saying yes.", author: "Jason Fried" },
  { text: "The hardest thing in product is figuring out what to build next.", author: "Ken Norton" },
  { text: "Impact divided by effort is the fundamental prioritization framework.", author: "Shreyas Doshi" },
  { text: "Most products fail not because of bad engineering, but because of bad prioritization.", author: "Marty Cagan" },
  { text: "Every yes is a no to something else.", author: "Shishir Mehrotra" },
  { text: "Bet on the problems, not the solutions.", author: "Melissa Perri" },
  // Metrics & Data
  { text: "What gets measured gets managed.", author: "Peter Drucker" },
  { text: "Not everything that counts can be counted, and not everything that can be counted counts.", author: "Albert Einstein" },
  { text: "Measure what matters.", author: "John Doerr" },
  { text: "Data beats opinion every single time.", author: "Ken Norton" },
  { text: "If you can't measure it, you can't improve it.", author: "Peter Drucker" },
  { text: "Metrics are a conversation starter, not a conversation ender.", author: "Lenny Rachitsky" },
  { text: "Vanity metrics make you feel good but don't help you understand your own performance in a way that will help you make good decisions.", author: "Eric Ries" },
  { text: "A product manager who can't use data is flying blind. A PM who only uses data is missing the soul of the product.", author: "Gibson Biddle" },
  { text: "Metrics should serve the mission, not the other way around.", author: "John Doerr" },
  { text: "North Star Metric: the single metric that best captures the core value that your product delivers to customers.", author: "Sean Ellis" },
  { text: "Retention is the single most important metric for product-market fit.", author: "Brian Balfour" },
  { text: "Without good data, you're just another person with an opinion.", author: "W. Edwards Deming" },
  // Vision & Leadership
  { text: "Start with why.", author: "Simon Sinek" },
  { text: "People don't buy what you do; they buy why you do it.", author: "Simon Sinek" },
  { text: "The best product managers are missionaries, not mercenaries.", author: "John Doerr" },
  { text: "A product vision is not a feature list. It's a future state of the world.", author: "Marty Cagan" },
  { text: "If you want to build a ship, don't drum up people to gather wood. Instead, teach them to yearn for the vast and endless sea.", author: "Antoine de Saint-Exupéry" },
  { text: "The role of the leader is not to come up with all the great ideas. It's to create an environment in which great ideas can happen.", author: "Simon Sinek" },
  { text: "Your job as a product leader is to be the voice of the customer in every meeting.", author: "Marty Cagan" },
  // Team & Collaboration
  { text: "The best product teams are cross-functional by design, not by accident.", author: "Marty Cagan" },
  { text: "Engineers are not resources. They are the creative force behind every product.", author: "Marty Cagan" },
  { text: "Culture eats strategy for breakfast.", author: "Peter Drucker" },
  { text: "No brilliant jerks. The team pays too high a team tax.", author: "Reed Hastings" },
  { text: "Hire people who are better than you, then leave them to get on with it.", author: "David Ogilvy" },
  { text: "Psychological safety is the belief that you won't be punished when you make a mistake.", author: "Amy Edmondson" },
  { text: "Autonomy, mastery, purpose — the three elements of true motivation.", author: "Daniel Pink" },
  { text: "Disagree and commit.", author: "Jeff Bezos" },
  { text: "Strong opinions, weakly held.", author: "Paul Saffo" },
  { text: "Speed is a team sport.", author: "Shreyas Doshi" },
  // Decision Making
  { text: "Most decisions should probably be made with somewhere around 70% of the information you wish you had.", author: "Jeff Bezos" },
  { text: "Two-way door decisions should be made fast. One-way door decisions should be made carefully.", author: "Jeff Bezos" },
  { text: "Deciding what not to do is as important as deciding what to do.", author: "Steve Jobs" },
  { text: "The goal of product discovery is to validate ideas with evidence, not opinion.", author: "Marty Cagan" },
  { text: "Embrace uncertainty. It's the price of entry for building new things.", author: "Scott Belsky" },
  { text: "Analysis paralysis kills more products than bad decisions.", author: "Ken Norton" },
  { text: "You have to be willing to be misunderstood if you're going to innovate.", author: "Jeff Bezos" },
  // Roadmaps
  { text: "A roadmap is a product strategy communication tool, not a feature request tracker.", author: "Melissa Perri" },
  { text: "The problem with roadmaps is that they confuse output with outcome.", author: "Melissa Perri" },
  { text: "Your roadmap is not a contract. It's a hypothesis.", author: "Jeff Patton" },
  { text: "Outcome-based roadmaps change the conversation from what are we building to what problems are we solving.", author: "Melissa Perri" },
  { text: "The best roadmaps are ones that can be explained in a single sentence.", author: "Gibson Biddle" },
  { text: "Ship the vision, not the roadmap.", author: "Ryan Singer" },
  { text: "Roadmaps are bets, not promises.", author: "Josh Seiden" },
  { text: "A roadmap without a strategy is just a list of features.", author: "Melissa Perri" },
  // Innovation & Zero to One
  { text: "The most contrarian thing of all is not to oppose the crowd but to think for yourself.", author: "Peter Thiel" },
  { text: "Competition is for losers.", author: "Peter Thiel" },
  { text: "All failed companies are the same: they failed to escape competition.", author: "Peter Thiel" },
  { text: "Innovation is seeing what everybody has seen and thinking what nobody has thought.", author: "Albert Szent-Gyorgyi" },
  { text: "Disruptive innovation creates a new market and value network, eventually displacing established markets.", author: "Clayton Christensen" },
  { text: "Creativity is just connecting things.", author: "Steve Jobs" },
  // Continuous Discovery
  { text: "Product discovery is not an event. It's a continuous process.", author: "Teresa Torres" },
  { text: "Opportunity mapping starts with the customer's desired outcome.", author: "Teresa Torres" },
  { text: "Assumption testing is the fastest way to reduce risk in product development.", author: "Teresa Torres" },
  { text: "Interview customers to discover opportunities, not to validate solutions.", author: "Teresa Torres" },
  { text: "Weekly customer touchpoints prevent building the wrong thing for months.", author: "Teresa Torres" },
  { text: "Continuous discovery is about making better decisions more often.", author: "Teresa Torres" },
  { text: "Outcome-driven teams outperform output-driven teams every time.", author: "Josh Seiden" },
  { text: "The job of the product team is to discover a product that is valuable, usable, feasible, and viable.", author: "Marty Cagan" },
  { text: "If discovery is separate from delivery, you've already lost.", author: "Teresa Torres" },
  // Shape Up & Basecamp
  { text: "Fixed time, variable scope is the key to shipping on time.", author: "Ryan Singer" },
  { text: "No backlogs. Backlogs are a weight that slows teams down.", author: "Jason Fried" },
  { text: "Six weeks is long enough to build something meaningful and short enough to feel the pressure.", author: "Ryan Singer" },
  { text: "Instead of committing to estimates, commit to appetites.", author: "Ryan Singer" },
  { text: "Meetings are toxic.", author: "Jason Fried" },
  { text: "Write it down. Writing forces clarity.", author: "Jason Fried" },
  // Good Strategy Bad Strategy
  { text: "A good strategy honestly acknowledges the challenges being faced and provides an approach to overcoming them.", author: "Richard Rumelt" },
  { text: "The kernel of a strategy contains three elements: a diagnosis, a guiding policy, and coherent actions.", author: "Richard Rumelt" },
  { text: "Fluff is a form of bad strategy. It is superficial verbiage dressed up to sound strategic.", author: "Richard Rumelt" },
  { text: "A leader who claims to have seventeen top priorities has no strategy.", author: "Richard Rumelt" },
  // Growth & Product-Market Fit
  { text: "Product-market fit means being in a good market with a product that can satisfy that market.", author: "Marc Andreessen" },
  { text: "You can always feel when product-market fit is not happening.", author: "Marc Andreessen" },
  { text: "The only thing that matters is getting to product/market fit.", author: "Marc Andreessen" },
  { text: "Retention is the foundation. Everything else is noise.", author: "Brian Balfour" },
  { text: "The best growth strategy is building a product people love.", author: "Sam Altman" },
  { text: "Product-market fit is a feeling before it's a metric.", author: "Andy Rachleff" },
  { text: "Churn is the enemy of growth.", author: "David Skok" },
  { text: "Activation is the moment when a new user first experiences the core value of your product.", author: "Sean Ellis" },
  // Jeff Bezos & Amazon
  { text: "We see our customers as invited guests to a party, and we are the hosts.", author: "Jeff Bezos" },
  { text: "Your margin is my opportunity.", author: "Jeff Bezos" },
  { text: "We are stubborn on vision. We are flexible on details.", author: "Jeff Bezos" },
  { text: "Customers are always beautifully, wonderfully dissatisfied.", author: "Jeff Bezos" },
  { text: "Work backwards from the customer, not forward from the product.", author: "Jeff Bezos" },
  { text: "It's not an experiment if you know it's going to work.", author: "Jeff Bezos" },
  { text: "Invention requires a long-term willingness to be misunderstood.", author: "Jeff Bezos" },
  // Steve Jobs & Apple
  { text: "You've got to start with the customer experience and work back toward the technology.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Simple can be harder than complex. You have to work hard to get your thinking clean to make it simple.", author: "Steve Jobs" },
  { text: "It's not the customer's job to know what they want.", author: "Steve Jobs" },
  { text: "We're here to put a dent in the universe. Otherwise why else even be here?", author: "Steve Jobs" },
  { text: "Quality is more important than quantity. One home run is much better than two doubles.", author: "Steve Jobs" },
  { text: "Focus is about saying no.", author: "Steve Jobs" },
  { text: "Details matter, it's worth waiting to get it right.", author: "Steve Jobs" },
  // Inspired (Marty Cagan Extended)
  { text: "The best product managers are the ones who are deeply in love with the problem.", author: "Marty Cagan" },
  { text: "The purpose of product discovery is to address four critical risks: value, usability, feasibility, and business viability.", author: "Marty Cagan" },
  { text: "Technology-enabled products are not projects. They are ongoing product efforts.", author: "Marty Cagan" },
  { text: "The team needs to feel the problem, not just be told the solution.", author: "Marty Cagan" },
  { text: "Outcome is not the output. Shipping software is not the goal. The goal is change in customer behavior.", author: "Marty Cagan" },
  { text: "Product culture is about continuous learning, not continuous planning.", author: "Marty Cagan" },
  // PM Wisdom
  { text: "The product manager is the CEO of the product.", author: "Ben Horowitz" },
  { text: "Good product managers take responsibility. Bad product managers blame the engineers.", author: "Ben Horowitz" },
  { text: "Great PMs make their team smarter. Good PMs make themselves smarter.", author: "Shreyas Doshi" },
  { text: "Influence without authority is the defining skill of a product manager.", author: "Shreyas Doshi" },
  { text: "The best PMs are T-shaped: broad knowledge, deep expertise in one area.", author: "Lenny Rachitsky" },
  { text: "Your job as a PM is to make your team successful, not to be the hero.", author: "Ken Norton" },
  { text: "Don't ask for permission to talk to customers. Just do it.", author: "Teresa Torres" },
  // Continuous Improvement
  { text: "Every system is perfectly designed to get the results it gets.", author: "W. Edwards Deming" },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Continuous improvement is better than delayed perfection.", author: "Mark Twain" },
  // Communication & Writing
  { text: "If you can't explain it simply, you don't understand it well enough.", author: "Albert Einstein" },
  { text: "The single biggest problem in communication is the illusion that it has taken place.", author: "George Bernard Shaw" },
  { text: "No PowerPoints at Amazon. We write narratives.", author: "Jeff Bezos" },
  { text: "Writing is thinking. To write well is to think clearly.", author: "David McCullough" },
  // Timeless
  { text: "Done is the engine of more.", author: "Bre Pettis" },
  { text: "Ideas are cheap. Execution is expensive.", author: "Chris Sacca" },
  { text: "No plan survives contact with the enemy.", author: "Helmuth von Moltke" },
  { text: "In preparing for battle I have always found that plans are useless, but planning is indispensable.", author: "Dwight D. Eisenhower" },
  { text: "Be stubborn about goals, flexible about methods.", author: "Naval Ravikant" },
  { text: "The best product teams are those that care more about outcomes than output.", author: "Jeff Gothelf" },
  { text: "Users don't read, they scan.", author: "Steve Krug" },
  { text: "Don't make me think.", author: "Steve Krug" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "If you're not growing, you're dying.", author: "Lou Holtz" },
  { text: "The best products make complex things simple, not simple things complex.", author: "Intercom" },
  { text: "Good design is obvious. Great design is transparent.", author: "Joe Sparano" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
]

export default function GlobalHeader() {
  const [time, setTime] = useState("")
  const [isDay, setIsDay] = useState(true)
  const [quote, setQuote] = useState<Quote>(QUOTES[0])
  const [spinning, setSpinning] = useState(false)

  const pickRandom = useCallback(() => {
    setSpinning(true)
    const idx = Math.floor(Math.random() * QUOTES.length)
    setQuote(QUOTES[idx])
    setTimeout(() => setSpinning(false), 400)
  }, [])

  // Pick initial random quote on mount
  useEffect(() => { pickRandom() }, [])

  // Auto-rotate mỗi 30 giây
  useEffect(() => {
    const id = setInterval(pickRandom, 30_000)
    return () => clearInterval(id)
  }, [pickRandom])

  // Live clock
  useEffect(() => {
    function tick() {
      const now = new Date()
      const h = now.getHours()
      const m = String(now.getMinutes()).padStart(2, "0")
      const s = String(now.getSeconds()).padStart(2, "0")
      setTime(`${h}:${m}:${s}`)
      setIsDay(h >= 6 && h < 18)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const displayText = `"${quote.text}" — ${quote.author}`

  return (
    <div
      className="flex h-9 items-center gap-3 px-4 fixed left-0 right-0 z-[45]"
      style={{ top: "0", background: "oklch(0.14 0.05 265)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div
          className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-white"
          style={{ background: "oklch(0.55 0.22 265)" }}
        >
          Z
        </div>
        <span className="text-xs font-semibold text-white/80 tracking-wide">ZBS Product</span>
      </div>

      <div className="h-3 w-px bg-white/15 mx-0.5" />

      {/* Nav search button */}
      <button
        onClick={openNavSearch}
        className="flex items-center gap-1.5 h-6 rounded px-2 text-[11px] text-white/65 hover:text-white/90 hover:bg-white/10 transition-colors shrink-0 border border-white/20 hover:border-white/30"
        title="Tìm nhanh trang (⌘K)"
      >
        <Search className="h-3 w-3" />
        <span className="hidden sm:inline">Tìm trang</span>
        <kbd className="text-[9px] opacity-60 font-mono hidden md:inline">⌘K</kbd>
      </button>

      <div className="h-3 w-px bg-white/15 mx-0.5" />

      {/* Quote + refresh */}
      <button
        onClick={() => pickRandom()}
        className="flex-1 flex items-center gap-2 min-w-0 justify-center group cursor-pointer"
        title="Click để đổi quote"
      >
        <p className="text-[11px] text-white/65 italic truncate max-w-[600px] group-hover:text-white/85 transition-colors" title={displayText}>
          {displayText}
        </p>
        <RefreshCw className={`h-3 w-3 shrink-0 text-white/20 group-hover:text-white/50 transition-all duration-300 ${spinning ? "rotate-180" : ""}`} />
      </button>

      {/* Time + icon */}
      <div className="flex items-center gap-1 shrink-0 font-mono text-[11px] tabular-nums text-white/50">
        {isDay
          ? <Sun className="h-3 w-3 text-amber-300/80" />
          : <Moon className="h-3 w-3 text-indigo-300/80" />
        }
        <span>{time}</span>
      </div>

      <div className="h-3 w-px bg-white/15 mx-0.5" />

      {/* Tool group: Design + Phone */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={openDesignPanel}
          className="flex items-center justify-center h-6 w-6 rounded hover:bg-white/10 transition-colors"
          title="Design System"
        >
          <Layers className="h-3.5 w-3.5 text-white/65 hover:text-white/90 transition-colors" />
        </button>
        <button
          onClick={openPhone}
          className="flex items-center justify-center h-6 w-6 rounded hover:bg-white/10 transition-colors"
          title="Điện thoại thử nghiệm"
        >
          <Smartphone className="h-3.5 w-3.5 text-white/65 hover:text-white/90 transition-colors" />
        </button>
      </div>

      {/* Global nav search modal — mounted here, rendered via portal above everything */}
      <GlobalNavSearch />
      <GlobalDesignPanel />
    </div>
  )
}
