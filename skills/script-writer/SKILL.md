---
name: script-writer
description: This skill should be used whenever users need YouTube video scripts written. On first use, collects comprehensive preferences including script type, tone, target audience, style, video length, hook style, use of humor, personality, and storytelling approach. Generates complete, production-ready YouTube scripts tailored to user's specifications for any topic. Maintains database of preferences and past scripts for consistent style.
---

# Script Writer

## Overview

This skill transforms Claude into a professional YouTube scriptwriter that understands your unique style and generates complete, engaging video scripts optimized for viewer retention and engagement.

## When to Use This Skill

Invoke this skill for YouTube scriptwriting tasks:
- Writing complete video scripts
- Creating hooks and introductions
- Structuring content for engagement
- Adapting scripts to different formats
- Maintaining consistent voice and style
- Generating multiple script variations

## Workflow

### Step 1: Check for Existing Preferences

```bash
python3 scripts/script_db.py is_initialized
```

If "false", proceed to Step 2. If "true", proceed to Step 3.

### Step 2: Initial Preference Collection

Collect comprehensive scriptwriting preferences:

**Script Types (can select multiple):**
- Educational/Tutorial
- Listicle/Top X
- Story/Narrative
- Review
- Vlog style
- Commentary/Opinion
- How-to
- Explainer
- Entertainment

**Tone:**
- Professional/Authoritative
- Casual/Friendly
- Energetic/Enthusiastic
- Educational/Patient
- Inspirational/Motivational
- Humorous/Entertaining
- Conversational

**Target Audience:**
- Age range (teens, 20s-30s, 35-50, 50+)
- Knowledge level (beginners, intermediate, expert)
- Demographics
- Interests
- Pain points

**Style Preferences:**
- Wording style: Simple/Direct, Descriptive/Vivid, Technical/Precise, Storytelling
- Sentence length: Short/punchy, Medium, Long/flowing
- Paragraph structure: Quick cuts, Balanced, Longer sections
- Use of rhetorical questions: Yes/No/Sometimes
- Use of statistics/data: Heavy, Moderate, Light, None

**Video Length Preference:**
- Short form (3-5 minutes, ~450-750 words)
- Medium form (7-12 minutes, ~1,050-1,800 words)
- Long form (15-30 minutes, ~2,250-4,500 words)

**Hook Style:**
- Question-based
- Bold statement
- Conflict/Problem
- Promise/Benefit
- Shock value
- Story opening

**Personality:**
- Energetic and animated
- Calm and measured
- Witty and humorous
- Serious and thoughtful
- Passionate and intense
- Relatable and down-to-earth

**Additional Preferences:**
- Use humor: Yes/No/Sparingly
- Include statistics: Always/When relevant/Rarely
- Storytelling approach: Heavy/Moderate/Light
- Call-to-action preference: Direct/Soft/Minimal
- Personal anecdotes: Frequently/Occasionally/Rarely
- Channel niche/focus

**Saving Preferences:**

```python
import sys
sys.path.append('[SKILL_DIR]/scripts')
from script_db import save_preferences

preferences = {
    "script_types": ["educational", "listicle"],
    "tone": "casual-friendly",
    "target_audience": {
        "age_range": "20s-30s",
        "knowledge_level": "beginner-intermediate",
        "interests": ["productivity", "technology"]
    },
    "style": {
        "wording": "simple-direct",
        "sentence_length": "short-punchy",
        "use_questions": True,
        "use_statistics": "moderate"
    },
    "video_length": "medium",
    "hook_style": "question-problem",
    "personality": "relatable-energetic",
    "use_humor": True,
    "storytelling_approach": "moderate",
    "call_to_action_preference": "direct",
    "channel_niche": "productivity tips"
}

save_preferences(preferences)
```

### Step 3: Generate Script for Topic

When user requests a script, gather:

**Essential Information:**
1. **Topic/Title**: What the video is about
2. **Key Points**: Main things to cover (3-5 points)
3. **Video Length**: Specific duration or use preference
4. **Special Requirements**: Anything specific to include/avoid
5. **Target Keywords**: For SEO (optional)

**Example Request:**
```
User: "Write a script about '5 Productivity Apps That Changed My Life'"

Gather:
- Video length: 10 minutes (medium form)
- Key apps to cover: 5 specific apps
- Angle: Personal experience + practical benefits
- CTA: Link to full app list in description
```

### Step 4: Structure the Script

Based on preferences and `references/script_formats.md`, create structure:

**Standard YouTube Script Structure:**

```
[HOOK - 0:00-0:10]
Opening line that stops the scroll

[INTRO - 0:10-0:45]
- Quick greeting
- What video is about
- Why viewer should watch
- What they'll learn
- Personal credibility/context

[MAIN CONTENT - 0:45-8:30]
Section 1: [Point 1]
- Introduction to point
- Explanation
- Example/Story
- Benefit/Application
- Transition

Section 2: [Point 2]
- Introduction to point
- Explanation
- Example/Story
- Benefit/Application
- Transition

[Continue for each main point]

[CONCLUSION - 8:30-9:30]
- Recap of main points
- Key takeaway
- Final thought
- Setup for CTA

[CALL TO ACTION - 9:30-10:00]
- Primary CTA (subscribe, like, comment)
- Secondary CTA (links, next video)
- Sign-off
```

### Step 5: Write Complete Script

Moved to `references/step-5-write-complete-script.md`. Open it when you reach this step.


### Step 6: Refine Based on Feedback

After presenting script:

**Offer Adjustments:**
- Make hook stronger
- Adjust length (trim or expand)
- Change tone (more/less formal)
- Add/remove humor
- Include more statistics
- Simplify language
- Add storytelling elements
- Strengthen CTA

**Save Final Version:**

```python
from script_db import add_script

script = {
    "title": "5 Productivity Apps That Changed My Life",
    "type": "listicle-educational",
    "tone": "casual-friendly",
    "word_count": 1500,
    "duration_minutes": 10,
    "content": "[full script text]",
    "notes": "Strong personal angle, relatable examples"
}

add_script(script)
```

## Best Practices

### 1. Hook Creation
- First 5 seconds are crucial
- Make a promise
- Create curiosity
- Address a pain point
- Use pattern interrupts

### 2. Pacing
- Vary sentence length
- Mix short and long paragraphs
- Build momentum
- Strategic pauses
- Energy shifts

### 3. Engagement Techniques
- Direct questions to viewer
- Personal stories
- Relatable examples
- Anticipated objections
- Social proof

### 4. Retention Optimization
- Tease what's coming
- Use callback references
- Pattern interrupts every 30-60 seconds
- Strategic information gaps
- Payoff promises made

### 5. Call to Action
- One primary CTA
- Explain the benefit
- Make it specific
- Create light urgency
- Natural integration

## Script Templates

### Educational Tutorial Template

```
[HOOK] Problem statement + Promise of solution
[INTRO] Personal context + What you'll learn + Why it matters
[SECTION 1] Concept explanation
  - What it is
  - Why it matters
  - Common mistakes
[SECTION 2] Step-by-step process
  - Step 1 with visuals
  - Step 2 with examples
  - Step 3 with tips
[SECTION 3] Common pitfalls
  - What to avoid
  - Troubleshooting
[CONCLUSION] Recap + Key takeaway + Next steps
[CTA] Subscribe + Resources + Comment prompt
```

### Listicle Template

```
[HOOK] Number tease + Unexpected angle
[INTRO] Context + Why this list matters
[ITEM 5] (Build suspense with countdown)
  - What it is
  - Why it works
  - How to use it
[ITEM 4] Repeat structure
[ITEM 3] Repeat structure
[ITEM 2] Repeat structure
[ITEM 1] (Most important/surprising)
  - Extra emphasis
  - Best benefit
[CONCLUSION] Recap numbers + Ultimate takeaway
[CTA] Strong directive + Resource mention
```

### Story/Narrative Template

```
[HOOK] Compelling story opening
[INTRO] Setup the story context
[SECTION 1] The problem/conflict
  - Build tension
  - Show stakes
  - Make it relatable
[SECTION 2] The journey
  - Challenges faced
  - Attempts and failures
  - Learning moments
[SECTION 3] The resolution
  - How it worked out
  - The transformation
[CONCLUSION] Lesson learned + How viewers can apply
[CTA] Invite similar stories + Subscribe
```

## Tone Examples

### Casual-Friendly
```
"Hey everyone! So, funny story – I completely messed this up last week.
Like, embarrassingly bad. But here's what I learned..."
```

### Professional-Authoritative
```
"In today's video, we're examining the three core principles that drive
successful implementation. Based on 5 years of data and research..."
```

### Energetic-Enthusiastic
```
"Okay, THIS is insane! I just discovered something that's going to blow
your mind. Are you ready? Because once you see this..."
```

### Educational-Patient
```
"Let's break this down step by step. Don't worry if it seems complicated
at first – by the end of this video, it'll make perfect sense. First..."
```

## Common Mistakes to Avoid

1. **Weak hooks** - Get to the point in 5 seconds
2. **Long intros** - Don't ramble before value
3. **No structure** - Viewers need signposts
4. **Monotone delivery** - Vary energy and pace
5. **Information overload** - Focus on key points
6. **Forgetting the audience** - Speak to them directly
7. **Buried CTA** - Make it clear and actionable
8. **No personality** - Let your unique voice show
9. **Too formal** - YouTube is conversational
10. **No visual cues** - Include filming notes

## Example Interaction

```
User: "Write me a script about passive income ideas"

Claude: [Checks preferences - finds casual-friendly tone, medium length, question hooks]

Perfect! Based on your style, I'll write a 10-minute script with your casual,
relatable tone. A few quick questions:

1. How many passive income ideas should I cover? (3-5 works well for 10 minutes)
2. Any specific angle? (beginner-friendly, high-earning, low startup cost?)
3. Personal experience or research-based approach?

User: "5 ideas, beginner-friendly, mix of both personal experience and research"

Claude: [Generates complete script]

Here's your complete script for "5 Passive Income Ideas for Beginners":

[Full formatted script with hook, intro, 5 ideas with personal stories and data,
conclusion, and CTA – all in user's casual-friendly style]

The script is 1,450 words (~10 minutes) with:
✓ Question-based hook about financial freedom
✓ Personal story in intro about your first passive income
✓ Each idea includes: what it is, startup cost, time investment, real example
✓ Mix of your experience and statistics
✓ Natural humor in transitions
✓ Direct CTA about free passive income guide

Want me to adjust anything? I can make it more personal, add more data, or
change the energy level.
```

## Technical Notes

**Data Storage:**
- Location: `~/.claude/script_writer.json`
- Preferences saved persistently
- Script history maintained

**CLI Commands:**
```bash
python3 scripts/script_db.py is_initialized
python3 scripts/script_db.py get_preferences
python3 scripts/script_db.py get_scripts
python3 scripts/script_db.py stats
```

**Word Count Guidelines:**
- Speaking pace: ~150 words per minute
- Short form (3-5 min): 450-750 words
- Medium form (7-12 min): 1,050-1,800 words
- Long form (15-30 min): 2,250-4,500 words

## Resources

### scripts/script_db.py
Database management for preferences, scripts, and templates.

### references/script_formats.md
Comprehensive guide covering:
- Common YouTube video types and structures
- Script component breakdowns (hook, intro, content, conclusion, CTA)
- Tone guidelines for different styles
- Timing guidelines by video length
- Engagement techniques
- Common mistakes to avoid
- Visual cues for scripts
- Audience-specific adjustments
- Platform-specific considerations