"""Generate a GitHub Universe-inspired hero image for Tailspin Toys.

Design concept: A whimsical, fantastical wide banner illustration inspired by
GitHub Universe's hero art style — featuring dreamy clouds, rich purple/pink/blue 
gradient transitions, isometric 3D elements, and 1-2 nostalgic toys peeking 
out of a magical scene. Glassy, modern, playful but premium.
"""
from generate_nostalgic_toys import generate_image

prompt = """Create a WHIMSICAL, FANTASTICAL wide banner illustration for a nostalgic toy shop called Tailspin Toys.

ART STYLE (CRITICAL — follow this closely):
- Inspired by GitHub Universe conference illustrations
- Soft 3D isometric style with glassy, translucent elements
- Clean, modern vector-illustration feel rendered in 3D
- Smooth gradients, soft lighting, toy-like miniature world aesthetic
- NOT photorealistic — stylized, playful, premium illustration

THE SCENE:
- A charming wooden BOOKSHELF (like a real bookcase with multiple shelves/tiers, a back panel, and side panels) positioned on the RIGHT SIDE of the image
- The bookshelf is rendered in warm wood tones, in isometric 3D perspective, with soft magical glow
- The bookshelf is surrounded by dreamy pastel clouds, sparkles, and soft aurora light — as if it exists in a magical cloud world
- The entire left half of the image should be mostly open sky/clouds/gradient — NO toys or shelf on the left (this is for text overlay)

ON THE BOOKSHELF (exactly these 3 toys, small and charming, arranged on different shelf tiers):
1. A FURBY — the iconic 1998 fluffy owl-like creature with big round expressive eyes, large ears, and colorful fur. Sitting on one shelf tier
2. A SIMON game — the classic round electronic memory game disc with four large colored quadrant buttons (red, blue, green, yellow) in a black housing. Placed on another shelf tier
3. A WATER RING TOSS game — the classic handheld clear plastic case filled with water and floating rings. Standing on another shelf tier

The toys should be SMALL relative to the bookshelf — like real toys sitting on a real bookcase. Cozy, charming, well-arranged. Maybe a few tiny decorative touches on the shelves too (a small star, a tiny book, subtle sparkles).

BACKGROUND & ATMOSPHERE:
- Rich gradient sky that transitions from warm saffron/peach on the left to purple/blue/pink on the right
- Dreamy soft clouds everywhere — the bookshelf exists in a magical cloud world
- Subtle sparkle/star effects and soft bokeh light
- The LEFT HALF should be mostly empty gradient sky with gentle clouds — keep it clean and open for text overlay
- The bookshelf and toys are all on the RIGHT SIDE of the composition
- Warm, magical, dreamlike atmosphere throughout

COLOR PALETTE:
- Warm saffron orange: #E8792B, #F5A623 (left side warmth)
- Soft lavender: #C4B5FD, #B794F4 (cloud tones)
- Deep purple: #7C3AED, #6D28D9 (sky accent)
- Dreamy pink: #F472B6, #EC4899 (cloud accents)
- Soft sky blue: #93C5FD, #60A5FA (sky/cloud areas)
- Warm gold: #FCD34D (sparkle highlights)
- Cloud white/cream: #F3F0FF, #FFF7ED (clouds)
- Warm honey/walnut brown for the bookshelf wood

COMPOSITION:
- Wide landscape format — approximately 1920x800 banner proportions
- LEFT 50% is open gradient sky with soft clouds — clean, minimal, for text overlay
- RIGHT 50% has the bookshelf with the 3 small toys on it
- The bookshelf should be clearly visible but not cramped — give it room to breathe
- Feels spacious, magical, dreamy — NOT cluttered

MOOD:
- A magical bookshelf floating in a dream sky, holding childhood treasures
- Warm nostalgia meets fantasy wonder
- Premium and polished but playful and charming
- The feeling of "your childhood shelf" preserved in a magical place

CRITICAL REQUIREMENTS:
- NO text, words, letters, logos, or watermarks of ANY kind
- NO humans or people
- Exactly 3 toys on the bookshelf: Furby, Simon game, Water Ring Toss — all SMALL on the shelf
- The shelf must be a BOOKSHELF/BOOKCASE — with a back panel, multiple horizontal shelves, and side panels like real furniture
- Bookshelf and toys positioned on the RIGHT side of the image
- LEFT side must be clean and open (gradient + clouds only) for text overlay
- HIGH QUALITY illustration, clean edges, professional finish
- Keep the 3D isometric perspective and magical cloud atmosphere"""

if __name__ == "__main__":
    print("Generating whimsical GitHub Universe-inspired hero image...")
    result = generate_image(prompt, "public/images/hero-cinematic.png")
    print(result)
