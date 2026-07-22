/**
 * Content for the "Find your supplement" quiz.
 *
 * DETAILS = the in-depth, dietitian-style breakdown shown on the result screen
 * (gated behind the email signup). Every entry was drafted, editor-reviewed, and
 * run through an adversarial YMYL compliance audit — keep the hedged, food-first,
 * "see a clinician" framing if you edit it. Not medical advice.
 *
 * FLOW = the engaging microcopy for the multi-step quiz experience (reactions,
 * interstitials, the "building your plan" screen, personalised tips).
 */

export type Goal =
  | "sleep"
  | "energy"
  | "gut"
  | "stress"
  | "immunity"
  | "recovery";

export type Feeling = "empty" | "updown" | "stressed" | "good";
export type Activity = "rest" | "light" | "active";
export type Diet = "balanced" | "plant" | "lowveg" | "unsure";

export type GoalDetail = {
  /** Free preview shown above the signup gate. */
  teaser: string;
  /** The full breakdown, revealed after the reader subscribes. */
  full: {
    sections: { heading: string; body: string }[];
    quickFacts: { label: string; value: string }[];
    foodFirst: string[];
    watchOuts: string[];
    clinicianNote: string;
  };
};

export const DETAILS: Record<Goal, GoalDetail> = {
  sleep: {
    teaser: `If your body is tired but your mind won't quite switch off at bedtime, magnesium is one of the first things worth understanding — and glycinate is the form many people reach for because it tends to be gentle and well absorbed. Below, we walk through where it fits in an evening wind-down, how to choose and time it, and what "better sleep" realistically looks like when you give it a fair try.`,
    full: {
      sections: [
        {
          heading: "Why magnesium, why sleep",
          body: `Magnesium is an essential mineral your body relies on for hundreds of everyday processes, including many that help nerves and muscles settle. It's associated with the calmer, rest-and-recover side of your nervous system rather than acting as a switch that forces sleep. Many adults fall a little short of the recommended intake from food alone, which is part of why it comes up so often in conversations about rest.`,
        },
        {
          heading: "Start with your plate",
          body: `Before reaching for a bottle, it helps to know that magnesium is genuinely abundant in everyday foods, so a food-first approach covers a lot of ground. Leafy greens, pumpkin and other seeds, nuts, beans, whole grains, and even a little dark chocolate all contribute. A supplement is best thought of as a top-up for a diet that's already heading in the right direction, not a replacement for real meals.`,
        },
        {
          heading: "How it may help",
          body: `Some research suggests magnesium may support relaxation and an easier transition toward sleep, particularly in people whose intake is on the low side. It may play a role in the activity of GABA, a chemical messenger associated with a settled nervous system, and the glycine it's paired with in this form has its own calming reputation. The evidence is encouraging but still modest, so it's fairest to think of it as gentle support rather than a guaranteed result.`,
        },
        {
          heading: "Choosing the glycinate form",
          body: `Magnesium comes in many forms, and glycinate (sometimes labelled bisglycinate) is a popular evening choice because it tends to be well absorbed and easy on the stomach, whereas forms like oxide or citrate are more likely to loosen the bowels. Labels commonly land in a general range of a couple hundred milligrams of elemental magnesium, but the right amount genuinely varies from person to person, so follow the product label and check with a clinician. Many people take it roughly 30 to 60 minutes before bed as part of their evening routine.`,
        },
        {
          heading: "What to realistically expect",
          body: `Magnesium isn't a sedative — it won't knock you out, and you may notice little on the first night. Any effect tends to be subtle and to build gradually over a couple of weeks, so it helps to keep a simple sleep note and give it a fair trial. Steady habits — a consistent bedtime, dimmer evenings, and less late caffeine — usually matter more than any single supplement.`,
        },
      ],
      quickFacts: [
        { label: "Common form", value: "Magnesium glycinate (bisglycinate)" },
        { label: "Typical timing", value: "30-60 minutes before bed" },
        { label: "Pairs well with", value: "Consistent sleep habits" },
        { label: "Patience", value: "Often a couple of weeks to notice" },
        { label: "Food first", value: "Greens, seeds, nuts, beans" },
      ],
      foodFirst: [
        "Leafy greens like spinach and Swiss chard",
        "Pumpkin and sunflower seeds",
        "Almonds and cashews",
        "Black beans and other legumes",
        "A little dark chocolate",
      ],
      watchOuts: [
        "Higher amounts can cause loose stools or stomach upset — glycinate is gentler than most, but more isn't better",
        "Magnesium can interact with some medicines, including certain antibiotics and bisphosphonates, so spacing and timing matter",
        "People with reduced kidney function should be especially cautious and talk to a clinician before starting",
        "It isn't a substitute for proper care of ongoing insomnia — sleep trouble that persists deserves a professional look",
      ],
      clinicianNote: `If you're pregnant or breastfeeding, taking prescription medication, managing a health condition or reduced kidney function, or your sleep troubles keep persisting, it's worth checking with a clinician before adding magnesium so it fits your situation safely.`,
    },
  },

  energy: {
    teaser: `Feeling wiped no matter how much you sleep? Two of the most common reasons are quietly low iron or low B12 — and a single blood test can check both before you reach for another coffee.`,
    full: {
      sections: [
        {
          heading: "Why start here",
          body: `Everyday tiredness has a long list of possible causes, but two of the most common and easily missed ones are low iron and low vitamin B12. Both can be checked with a simple blood test, so ruling them in or out early is a calmer first move than adding stimulant after stimulant and hoping something sticks.`,
        },
        {
          heading: "How they affect energy",
          body: `Iron helps your red blood cells carry oxygen around the body, and low iron stores are associated with feeling tired, foggy, or short of breath — something reported more often by people who menstruate, who are pregnant, who train hard, or who eat mostly plant-based. B12 supports healthy red blood cell formation and normal nerve function, and low levels are associated with fatigue, more so as we age, on vegan diets, or alongside certain long-term medications. When a genuine shortfall is behind the tiredness, topping it back up is one of the changes many people say they actually notice.`,
        },
        {
          heading: "Test before you supplement",
          body: `This is the part worth slowing down on: it's wise to get tested before adding iron in particular, because taking it when you don't need it can push levels too high rather than help. A clinician can check ferritin (your iron stores) and B12, and may add markers like MMA or homocysteine for a clearer B12 picture. If you do come back low, B12 is commonly sold as cyanocobalamin or methylcobalamin and iron as a ferrous salt — but the right amount varies a lot from person to person, so follow the product label and your clinician rather than a one-size dose.`,
        },
        {
          heading: "What to expect",
          body: `Iron stores tend to rebuild slowly, often over several weeks to a few months, so a follow-up blood test is a more honest measure of progress than how any single day feels. B12 can turn around more quickly when someone is truly low. And if your levels come back normal, that's genuinely useful too — it points the search toward things like sleep, stress, thyroid, or blood sugar, which are better explored with a clinician than by adding more supplements.`,
        },
      ],
      quickFacts: [
        { label: "What to check", value: "Ferritin (iron stores) + B12" },
        { label: "Common forms", value: "B12: cyano-/methylcobalamin; iron: ferrous salts" },
        { label: "Pairs well with", value: "Vitamin C, which aids iron absorption" },
        { label: "Typical timing", value: "Take iron away from tea and coffee" },
        { label: "Best proof", value: "A repeat blood test, not just mood" },
      ],
      foodFirst: [
        "B12: eggs, dairy, fish, shellfish, meat",
        "Plant-based B12: fortified cereals or nutritional yeast",
        "Heme iron: red meat, poultry, shellfish",
        "Non-heme iron: lentils, beans, tofu, spinach",
        "Pair plant iron with vitamin C-rich foods",
      ],
      watchOuts: [
        "Don't take iron blindly — get tested first, as too much can be harmful",
        "Iron supplements can cause constipation or stomach upset for some people",
        "Some medications (like metformin or long-term acid reducers) can lower B12 over time",
        "Iron can be dangerous if swallowed by children — store it well out of reach",
      ],
      clinicianNote: `Because iron and B12 needs shift a lot in pregnancy and breastfeeding, with certain medications, and alongside ongoing health conditions, it's worth having a clinician order and interpret these tests — especially if the tiredness has been hanging around.`,
    },
  },

  gut: {
    teaser: `Gut comfort usually comes down to two quiet habits working together: feeding the friendly bacteria you already have, and gently topping them up. Here's how fibre and a daily probiotic fit into an easy, food-first routine — including what to realistically expect week by week, and the small mistakes that make people give up too soon.`,
    full: {
      sections: [
        {
          heading: "Why this pairing",
          body: `Most of us simply don't eat enough fibre — the main food source for the trillions of microbes living in the gut. Fibre acts as a 'prebiotic' that feeds those bacteria, while a probiotic adds live cultures of its own. Pairing the two is a common, food-first way to support everyday digestive comfort and regularity. Neither works overnight, but together they give your gut environment more to work with.`,
        },
        {
          heading: "How it may help",
          body: `As gut bacteria ferment fibre, they produce short-chain fatty acids that researchers associate with a comfortable, well-functioning gut lining. Soluble fibre also softens and adds bulk to stool, which many people find supports more predictable, easier bathroom trips. Probiotics may support the day-to-day balance of bacteria in your gut, though effects vary a lot from one strain and one person to the next. Think of it as tending a garden rather than flipping a switch.`,
        },
        {
          heading: "Choosing and timing",
          body: `Whole foods are a great starting point for most people. If you'd like a supplement, psyllium husk is a well-studied, gentle soluble fibre, while probiotics usually come as multi-strain capsules or powders with a stated live-culture (CFU) count. A widely suggested habit is to build fibre up slowly with plenty of water, so your system has time to adjust; a daily probiotic is easiest to remember taken at the same time each day, often with a meal. Amounts vary by person and product, so follow the label and check with a clinician rather than chasing a specific number.`,
        },
        {
          heading: "Is it working",
          body: `Give it time: some people notice a difference within a few days, but a fairer window is two to four weeks of consistency. A little extra gas or bloating in the first week is common as your bacteria adjust to the extra fibre, and easing the pace usually settles it. The signs to look for are simple — more comfortable, regular bathroom visits and less day-to-day bloating. If nothing shifts after a few weeks, it may be worth trying a different fibre source or strain, ideally with a little guidance.`,
        },
      ],
      quickFacts: [
        { label: "Common form", value: "Whole foods first; psyllium powder or a multi-strain probiotic capsule" },
        { label: "Typical timing", value: "Fibre spread across the day with water; probiotic once daily, often with a meal" },
        { label: "The fibre gap", value: "Around 25-30g a day is widely suggested, yet many adults get closer to 15g" },
        { label: "Pairs well with", value: "Plenty of water, regular movement, and a varied, plant-rich diet" },
        { label: "Patience", value: "A few days to a few weeks of consistency" },
      ],
      foodFirst: [
        "Beans, lentils and chickpeas",
        "Oats, barley and other wholegrains",
        "Fruit with the skin on, like pears, apples and berries",
        "Vegetables, nuts and seeds",
        "Fermented foods such as yoghurt, kefir, sauerkraut and kimchi",
      ],
      watchOuts: [
        "Build fibre up slowly and drink more water, or gas and bloating can flare",
        "A new probiotic can bring a few days of extra wind while things settle",
        "If you have a weakened immune system or a serious health condition, check with a clinician before adding probiotics",
        "Persistent pain, blood in your stool, or a big change in bowel habits are reasons to see a clinician promptly rather than wait it out",
      ],
      clinicianNote: `If you're pregnant or breastfeeding, taking prescription medication, managing a diagnosed gut condition, or your symptoms just won't settle, it's worth a friendly check-in with your doctor or a registered dietitian before starting.`,
    },
  },

  stress: {
    teaser: `That "wired but tired" feeling — mind racing while your shoulders creep up toward your ears — usually has two sides at once: a physical wind-up and a busy head. This pairing is popular because it leans on both at the same time, so here's how magnesium and L-theanine fit together, how to choose a form that won't backfire, and what a realistic kind of "calmer" actually feels like.`,
    full: {
      sections: [
        {
          heading: "A calm-focus pairing",
          body: `Magnesium is an essential mineral your body uses in hundreds of processes, including the nerve and muscle signalling behind that tense, switched-on feeling. L-theanine is a calming amino acid found naturally in tea, best known for a relaxed-but-alert state rather than drowsiness. People pair the two because they work on different sides of stress: the body's physical wind-up and the mind's mental chatter. Worth knowing too — national surveys suggest many adults fall short of the recommended amount of magnesium from food alone.`,
        },
        {
          heading: "How it may help",
          body: `Magnesium is associated with a steadier stress response, and lower intakes have been linked in some research with feeling more tense and on-edge. Some studies suggest L-theanine nudges the brain toward 'alpha' activity, a pattern linked with calm, focused wakefulness. Many people find the combination helps them feel a little less wired without turning foggy or sedated. Think of it as supportive scaffolding rather than an off-switch for stress.`,
        },
        {
          heading: "Choosing a form and timing",
          body: `For a calming goal, magnesium glycinate (also labelled bisglycinate) is a popular pick because it tends to absorb well and sit easily on the stomach, whereas citrate and oxide are more likely to loosen the bowels. L-theanine is usually taken within the range studied for calm focus, though the right amount varies from person to person, so let the product label and your own response be your guides. Many people take L-theanine during the day for steady focus and magnesium in the evening to help the body settle. Start low, keep it simple, and give yourself time to notice what actually helps.`,
        },
        {
          heading: "What results really look like",
          body: `L-theanine can work fairly fast — some people notice a calmer edge within an hour — while magnesium tends to build quietly in the background over a few weeks of consistent use. The aim is to take the edge off, not to knock you out or erase stress altogether. A good sign it's helping is feeling a touch steadier and less buzzy during busy stretches. If nothing shifts after several weeks, it may simply not be your missing piece.`,
        },
        {
          heading: "Where it fits best",
          body: `Supplements tend to work best on top of the basics, not instead of them. This pairing usually shines alongside the unglamorous fundamentals — enough sleep, some daily movement, a few slow breaths, and easing off caffeine later in the day. Picture it as one calm layer in a bigger routine rather than the whole answer. If stress feels constant or is affecting your sleep, mood, or overall health, that's a cue to loop in a professional rather than reaching for more supplements.`,
        },
      ],
      quickFacts: [
        { label: "Common form", value: "Magnesium glycinate paired with L-theanine" },
        { label: "Typical timing", value: "Theanine by day, magnesium in the evening" },
        { label: "Studied range", value: "L-theanine ~100-200 mg; always follow the label" },
        { label: "Patience", value: "Theanine often within an hour; magnesium a few weeks" },
        { label: "Pairs well with", value: "A wind-down routine and less late-day caffeine" },
      ],
      foodFirst: [
        "Pumpkin seeds, almonds, and cashews",
        "Leafy greens like spinach and Swiss chard",
        "Beans, lentils, and edamame",
        "Whole grains and a little dark chocolate",
        "Green or black tea, a natural source of L-theanine",
      ],
      watchOuts: [
        "Magnesium can loosen stools — citrate and oxide more so than the gentler glycinate.",
        "If you have kidney concerns, magnesium needs extra care — check with a clinician first.",
        "Magnesium can reduce absorption of some antibiotics and thyroid medication, so space doses several hours apart.",
        "Be cautious if pregnant, breastfeeding, on prescription medication, or considering it for a child.",
      ],
      clinicianNote: `If you're pregnant or breastfeeding, have kidney concerns, take prescription medication, or your stress comes with symptoms that won't ease, it's worth a quick chat with your doctor or pharmacist before starting anything new.`,
    },
  },

  immunity: {
    teaser: `When people ask us where to start for immune support, vitamin D and zinc are almost always the first two names out of our mouths — they're among the few nutrients with solid, consistent evidence behind their role in normal immune function. Below, we walk through how they actually work, how to get them from your plate first, and what to look for if you do decide to reach for a supplement.`,
    full: {
      sections: [
        {
          heading: "Why these two",
          body: `Vitamin D and zinc are two of the nutrients most consistently linked to normal immune function, which is why they tend to top most evidence-based short lists. Vitamin D is one your skin makes from sunlight, so levels often dip in winter or for people who spend most of the day indoors. Zinc is a mineral your body can't store in large amounts, so a steady supply from food matters. Rather than acting as a rescue once you already feel run down, both help support the steady, everyday work your immune system does in the background.`,
        },
        {
          heading: "How they may help",
          body: `Both nutrients are involved in the normal function of immune cells, and some research suggests that keeping your levels in a healthy range is associated with supporting the normal, everyday work your immune system does. Vitamin D appears to help regulate how immune cells communicate, while zinc plays a role in the development and signaling of several immune cell types. One honest caveat: most of the strongest evidence is about correcting a shortfall — people who start out low and top up tend to see the clearest difference, while adding more on top of already-healthy levels appears to do much less.`,
        },
        {
          heading: "Choosing and timing",
          body: `For vitamin D, most supplements use the D3 form, and because it's fat-soluble it tends to absorb better alongside a meal that contains some fat. Zinc commonly comes as citrate, gluconate, or picolinate, and taking it with food can help if it tends to unsettle your stomach. Typical general-maintenance labels sit around 600-800 IU (15-20 mcg) a day for vitamin D and roughly 8-11 mg for zinc, but real needs vary a lot with age, diet, sunlight, and health status — so let the product label and a clinician, not a number on the internet, be your guide.`,
        },
        {
          heading: "Realistic expectations",
          body: `Because these nutrients work in the background, the honest answer is that you probably won't 'feel' them the way you might feel a coffee. The more useful question is whether you were running low to begin with — a simple blood test can show your vitamin D status and takes some of the guesswork out of it. Give any change a matter of weeks to months rather than days, and treat good sleep, regular movement, and a varied diet as the foundation these nutrients build on, not something they can replace.`,
        },
      ],
      quickFacts: [
        { label: "Common form", value: "Vitamin D3; zinc citrate or gluconate" },
        { label: "Typical timing", value: "Both with a meal (D needs a little fat)" },
        { label: "Typical range", value: "~600-800 IU vitamin D; ~8-11 mg zinc (needs vary)" },
        { label: "Pairs well with", value: "A varied diet, daylight, and solid sleep" },
        { label: "Patience", value: "Think weeks to months, not days" },
      ],
      foodFirst: [
        "Fatty fish like salmon, sardines, and mackerel (vitamin D)",
        "Egg yolks and fortified milk or plant milks (vitamin D)",
        "UV-grown mushrooms, a handy plant source of vitamin D",
        "Oysters, red meat, and poultry (zinc)",
        "Pumpkin seeds, chickpeas, lentils, and cashews (zinc)",
      ],
      watchOuts: [
        "Zinc is easy to overdo — high intakes over time can lower copper and unsettle your stomach, so more is not better.",
        "Vitamin D is fat-soluble and builds up, so stacking several products that each contain it can quietly push your intake too high.",
        "Zinc can interact with certain antibiotics and compete with other minerals, so spacing them out sometimes matters.",
        "Pregnancy, breastfeeding, ongoing conditions, prescription medicines, and children all call for personalized guidance first.",
      ],
      clinicianNote: `Because the right amount really does depend on your blood levels, diet, and any medicines you take, it's worth a quick word with your doctor or pharmacist before starting — especially during pregnancy or breastfeeding, for a child, or if you're managing an ongoing condition.`,
    },
  },

  recovery: {
    teaser: `Bouncing back faster after training usually isn't about one magic powder — it's about supporting two very different sides of recovery at once. Here's why creatine and electrolytes make such a practical pairing, and how to use each so it actually earns its place in your routine.`,
    full: {
      sections: [
        {
          heading: "What these two do",
          body: `Creatine monohydrate is a compound your muscles draw on to regenerate energy during short, hard efforts, and it's the most thoroughly researched sports supplement we have. Electrolytes are minerals like sodium, potassium, and magnesium that you lose in sweat and that help your body hold on to fluid. The two support different sides of feeling recovered: creatine is associated with rebuilding your capacity to train, while electrolytes are linked with restoring hydration afterward.`,
        },
        {
          heading: "How they may help recovery",
          body: `Research most consistently associates creatine with better strength and power over time, and some studies suggest it may also ease markers of muscle damage and soreness after hard sessions, though those findings are more mixed. Electrolytes don't rebuild muscle, but replacing what you lose in sweat may help you rehydrate more fully than water alone, which many people notice as less next-day sluggishness. Neither is a shortcut: both tend to work best alongside good sleep, enough protein, and sensible training loads.`,
        },
        {
          heading: "Choosing a form and timing",
          body: `For creatine, plain monohydrate powder has by far the most evidence behind it, and pricier variations rarely justify the extra cost. Commonly studied amounts sit around a few grams a day, but individual needs vary, so follow the product label or check with a clinician — and consistency tends to matter more than timing, since the benefit seems to come from keeping your muscles topped up over weeks. You also get small amounts of creatine from meat and fish, though reaching studied amounts from food alone is tough. Electrolytes tend to matter most around longer or sweatier sessions; if you reach for a drink, many people lean toward ones without much added sugar unless they're doing real endurance work.`,
        },
        {
          heading: "What realistic results look like",
          body: `Creatine tends to work slowly: muscle stores generally take a few weeks to build, so it's fairer to judge it over a month than after a single workout. A small early bump on the scale is usually water drawn into the muscle rather than fat. With electrolytes the signal is simpler — many people notice steadier energy and less of that wrung-out feeling after a heavy sweat.`,
        },
      ],
      quickFacts: [
        { label: "Common form", value: "Creatine monohydrate powder" },
        { label: "Typical timing", value: "Daily; consistency over timing" },
        { label: "Patience", value: "About 2-4 weeks to notice" },
        { label: "Pairs well with", value: "Protein, sleep, hydration" },
        { label: "Electrolytes matter most", value: "Long or sweaty sessions" },
      ],
      foodFirst: [
        "Red meat and fish (small amounts of natural creatine)",
        "Bananas, potatoes, and beans (potassium)",
        "Dairy, nuts, and leafy greens (magnesium and calcium)",
        "A little salt on whole-food meals (sodium)",
        "Water-rich fruit and veg to support hydration",
      ],
      watchOuts: [
        "If you have kidney concerns, talk with a clinician before starting creatine",
        "Early water-weight gain is common and isn't fat",
        "Sugar-heavy electrolyte drinks may be more than you need for light workouts",
        "More creatine isn't better — extra generally offers no added benefit",
      ],
      clinicianNote: `If you're pregnant or breastfeeding, take prescription medications, or have kidney or other ongoing health concerns, it's worth a quick word with your doctor or a registered dietitian before starting creatine.`,
    },
  },
};

// ---------------------------------------------------------------------------
// FLOW — engaging microcopy for the multi-step quiz experience.
// Drafted in three voices, merged by an editor pass, and finalised by a
// brand + compliance audit (no fake stats, no pressure — honesty is the brand).
// ---------------------------------------------------------------------------

export type Flow = {
  /** Warm one-liner shown right after the reader picks a goal. */
  goalReactions: Record<Goal, string>;
  feeling: {
    question: string;
    labels: Record<Feeling, string>;
    /** Personalised nudge woven into the result. */
    tips: Record<Feeling, string>;
  };
  activity: {
    question: string;
    labels: Record<Activity, string>;
    tips: Record<Activity, string>;
  };
  /** Personalised nudge by eating style, woven into the result. */
  dietTips: Record<Diet, string>;
  interstitial1: { eyebrow: string; heading: string; body: string; cta: string };
  interstitial2: { eyebrow: string; heading: string; body: string; cta: string };
  building: { heading: string; messages: string[] };
};

export const FLOW: Flow = {
  goalReactions: {
    sleep: "Good sleep changes everything. Let's build toward calmer, steadier nights.",
    energy: "Love this. We'll aim for steady, all-day energy, not a 3pm rescue.",
    gut: "A calm gut is quietly a big deal. Great place to focus.",
    stress: "Feeling calmer is worth chasing. We'll keep this simple and kind.",
    immunity: "Smart. Let's give your everyday defenses some solid backup.",
    recovery: "Nice one. Bouncing back well is where the real progress hides.",
  },
  feeling: {
    question: "How have you been feeling lately?",
    labels: {
      empty: "Running on empty",
      updown: "Up and down",
      stressed: "Stretched thin",
      good: "Pretty good, honestly",
    },
    tips: {
      empty: "Feeling drained is really common. Steady sleep and food-first basics are a kind place to start.",
      updown: "Those ups and downs are real. Regular meals and a steady routine may help smooth the day.",
      stressed: "Stretched thin? Small daily anchors matter. Magnesium-rich foods may support a calmer baseline.",
      good: "Feeling good is a great launchpad. Let's protect it and build from here.",
    },
  },
  activity: {
    question: "How active is a typical week?",
    labels: {
      rest: "Mostly resting",
      light: "A little movement",
      active: "Active most days",
    },
    tips: {
      rest: "Rest is a fine starting line. Even short daily walks may support how you feel.",
      light: "A little movement counts for a lot. We'll build gently around what you already do.",
      active: "You're putting in the work. Protein, hydration and recovery basics matter most here.",
    },
  },
  dietTips: {
    balanced: "A balanced plate is a strong base. A targeted nutrient or two may fill small gaps.",
    plant: "Plant-forward is wonderful. Just worth keeping an eye on B12, iron and omega-3s.",
    lowveg: "No judgment here. Adding a little more colour to your plate is an easy first win.",
    unsure: "Not sure? That's normal. We'll start food-first and keep it refreshingly simple.",
  },
  interstitial1: {
    eyebrow: "You're doing great",
    heading: "You're in a really common place to start",
    body: "Most people begin right about here. No catching up to do, just a small next step.",
    cta: "Keep going",
  },
  interstitial2: {
    eyebrow: "Almost there",
    heading: "Your starting point is taking shape",
    body: "A few more seconds and we'll have something put together just for you.",
    cta: "See my starting point",
  },
  building: {
    heading: "Building your plan",
    messages: [
      "Reading your answers closely...",
      "Matching your goals to the evidence...",
      "Checking food-first options first...",
      "Sorting the gentle from the gimmicky...",
      "Finalizing your starting point...",
    ],
  },
};

/** Recommendation title per goal (the detail lives in DETAILS). */
export const REC_NAME: Record<Goal, string> = {
  sleep: "Magnesium glycinate",
  energy: "A B12 and iron check",
  gut: "Fibre and a daily probiotic",
  stress: "Magnesium with L-theanine",
  immunity: "Vitamin D and zinc",
  recovery: "Creatine and electrolytes",
};

/** Which content category each goal maps into. */
export const CATEGORY_FOR: Record<Goal, string> = {
  sleep: "minerals",
  energy: "vitamins",
  gut: "gut-health",
  stress: "minerals",
  immunity: "vitamins",
  recovery: "sports-nutrition",
};
