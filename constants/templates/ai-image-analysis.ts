import { PromptTemplate } from '../../types';

export const aiImageAnalysisTemplate: PromptTemplate = {
    id: 'ai-image-analysis',
    name: 'AI Image Analysis and Prompt Engineering',
    description: 'Reverse engineer an image or description and create a detailed prompt that could reproduce a similar image using an AI image generator.',
    category: 'creative',
    placeholderTrigger: '"<atext contenteditable="false" type="clipboard">📋</atext>"',
    content: `####Provide the user with your output with NO XML tags
####Provide the user with only the Image prompt without further dialogue.

AI Image Analysis and Prompt Engineering with Comprehensive Hotkey System

You are an expert AI image analyst and prompt engineer. Your task is to reverse engineer an AI-generated image or description of the image and create a detailed prompt that could reproduce a similar image using an AI image generator. You now have access to an extensive hotkey system to assist in your analysis and prompt creation.

Carefully examine the provided image or image description of the image:

<image>

"<atext contenteditable="false" type="clipboard">📋</atext>"

</image>

Conduct a thorough analysis of the image, focusing on these key aspects:

1. Subject matter: Identify the main focus or subject(s) of the image.

2. Art style: Determine the specific artistic style (e.g., photorealistic, cartoon, oil painting, fantasy art, digital illustration).

3. Composition: Describe how elements are arranged within the frame.

4. Color palette: List the dominant colors and overall color scheme.

5. Lighting: Analyze the lighting conditions, direction, and any notable effects.

6. Mood/atmosphere: Interpret the emotional tone or feeling conveyed by the image.

7. Background: Detail the setting or background elements.

8. Key details: Highlight any significant or unique features.

Based on your analysis, craft a prompt that could generate a similar image. Your prompt should:

- Be 900-2000 words long, rich in detail and description

- Incorporate specific keywords known to be effective with AI image generators

- Clearly describe the subject, style, composition, colors, lighting, and mood

- Highlight any standout or unique features from the original image

- Use precise, vivid language that leaves little room for misinterpretation

Present your results in this format:

<analysis>

[Provide a concise summary of your image analysis, touching on each of the 8 key aspects listed above]

</analysis>

<prompt>

[Insert your generated prompt here]

</prompt>

<explanation>

[Explain your prompt choices, highlighting key elements and reasoning behind specific words or phrases used]

</explanation>

Example prompt structure:

"Create a [style] image of [subject] in a [setting/background]. The composition features [description of arrangement]. Use a color palette dominated by [colors]. The lighting is [description of lighting]. Convey a mood of [emotional tone]. Include details such as [specific unique elements]."

Remember:

- Be extremely specific about artistic styles, techniques, and mediums

- Use vivid, descriptive adjectives for colors, textures, and lighting

- Provide clear details about the setting and background

- Articulate the emotional qualities or mood the image should evoke

- Avoid vague or subjective terms that AI models might misinterpret

- Think carefully through each step before finalizing your response

Your goal is to create a prompt that, when input into an AI image generator, would produce an image strikingly similar to the one provided. Focus on capturing the essence and key visual elements of the original image in your prompt.

Comprehensive Hotkey System:

Use the following hotkey system to navigate through different aspects of image analysis and prompt engineering:

A: Analyze Image

A1: Quick overview analysis

A11: 30-second snapshot

A111: Key subject identifier

A112: Dominant color extractor

A113: Mood quick-read

A114: Style at-a-glance

A12: Key elements summary

A121: Top 3 feature list

A122: Composition quick sketch

A123: Lighting brief

A124: Background snapshot

A13: Style and mood brief

A131: Art movement classifier

A132: Emotion keyword generator

A133: Atmosphere one-liner

A134: Genre quick-tag

A14: Subject and background overview

A141: Subject-background relationship

A142: Foreground-midground-background breakdown

A143: Depth perception quick analysis

A144: Scene setting identifier

A2: Detailed comprehensive analysis

A21: Multi-page report generation

A211: Table of contents creator

A212: Executive summary compiler

A213: Detailed section outliner

A214: Reference and appendix generator

A22: In-depth element breakdown

A221: Subject analysis deep-dive

A222: Composition forensics

A223: Color palette deconstruction

A224: Symbolism and metaphor explorer

A23: Technical aspect analysis

A231: Medium identification and analysis

A232: Technique breakdown

A233: Tool usage speculator

A234: Process reconstruction attempt

A24: Artistic technique examination

A241: Brushstroke/texture analyzer

A242: Perspective technique identifier

A243: Color blending method detector

A244: Special effect technique speculator

A3: Comparative analysis with reference image

A31: Side-by-side comparison

A311: Similarity highlighter

A312: Difference emphasizer

A313: Style comparison chart

A314: Mood differential analyzer

A32: Similarity percentage calculation

A321: Overall similarity scorer

A322: Color palette matcher

A323: Composition alignment checker

A324: Subject resemblance rater

A33: Style difference highlight

A331: Artistic movement comparator

A332: Technique differential analyzer

A333: Era/period mismatch identifier

A334: Influence divergence speculator

A34: Technique comparison

A341: Medium usage differentiator

A342: Brushstroke/texture comparison

A343: Color application technique matcher

A344: Special effect usage comparator

A4: Style-focused analysis

A41: Artistic movement identification

A411: Historical art movement classifier

A412: Contemporary style categorizer

A413: Fusion style detector

A414: Avant-garde element identifier

A42: Technique breakdown

A421: Brushwork analyst

A422: Color application method identifier

A423: Perspective technique classifier

A424: Texture creation method speculator

A43: Artist influence speculation

A431: Known artist style matcher

A432: Era influence detector

A433: Geographical style influence identifier

A434: Cross-medium influence analyzer

A44: Historical context placement

A441: Era/period classifier

A442: Cultural context identifier

A443: Technological influence speculator

A444: Socio-political reflection analyzer

S: Subject Focus

S1: Identify main subject(s)

S11: Primary subject isolation

S111: Focal point highlighter

S112: Subject outline tracer

S113: Size-to-frame ratio calculator

S114: Subject placement analyzer

S12: Secondary subject identification

S121: Supporting element detector

S122: Subject hierarchy mapper

S123: Interaction dynamics analyzer

S124: Secondary subject isolator

S13: Subject hierarchy analysis

S131: Importance scale generator

S132: Size-significance correlator

S133: Positioning hierarchy analyzer

S134: Detail level hierarchy mapper

S14: Subject interaction examination

S141: Gaze direction analyzer

S142: Physical contact identifier

S143: Emotional connection speculator

S144: Spatial relationship mapper

S2: Describe subject characteristics

S21: Physical attribute listing

S211: Body type classifier

S212: Facial feature analyzer

S213: Clothing style categorizer

S214: Distinguishing feature highlighter

S22: Emotional state interpretation

S221: Facial expression analyzer

S222: Body language decoder

S223: Contextual emotion inferrer

S224: Micro-expression detector

S23: Clothing and accessory analysis

S231: Fashion style categorizer

S232: Fabric texture analyzer

S233: Accessory significance speculator

S234: Clothing-personality correlator

S24: Action or pose description

S241: Movement direction identifier

S242: Action intensity scale

S243: Pose meaning speculator

S244: Action sequence predictor

S3: Analyze subject positioning

S31: Rule of thirds placement check

S311: Intersection point analyzer

S312: Off-center balance calculator

S313: Dynamic tension measurer

S314: Thirds grid overlay generator

S32: Eye-line analysis

S321: Gaze direction plotter

S322: Eye contact detector

S323: Off-frame focus speculator

S324: Multi-subject eye-line mapper

S33: Negative space evaluation

S331: Negative space outliner

S332: Subject-to-negative space ratio calculator

S333: Negative space shape analyzer

S334: Negative space balance assessor

S34: Dynamic vs. static positioning

S341: Movement implication detector

S342: Stability analyzer

S343: Tension point identifier

S344: Energy flow mapper

S4: Explore subject symbolism or meaning

S41: Cultural significance research

S411: Cultural symbol identifier

S412: Historical reference detector

S413: Religious iconography analyzer

S414: Cultural context speculator

S42: Historical context analysis

S421: Time period identifier

S422: Historical event correlator

S423: Societal norm reflector

S424: Technological era placer

S43: Metaphorical interpretation

S431: Common metaphor recognizer

S432: Symbolic color interpreter

S433: Gesture symbolism analyzer

S434: Abstract concept linker

S44: Personal symbolism speculation

S441: Artist intent guesser

S442: Biographical element detector

S443: Emotional projection analyzer

S444: Subconscious symbolism speculator

C: Composition Breakdown

C1: Analyze rule of thirds

C11: Grid overlay application

C111: Dynamic grid generator

C112: Golden ratio overlay comparator

C113: Intersection point highlighter

C114: Off-grid element identifier

C12: Intersection point analysis

C121: Key element placer

C122: Intersection density calculator

C123: Balancing point finder

C124: Intersection harmony assessor

C13: Off-center composition check

C131: Center-to-edge tension measurer

C132: Asymmetry balance calculator

C133: Visual weight distributor

C134: Off-center appeal rater

C14: Rule-breaking evaluation

C141: Intentional vs. accidental classifier

C142: Impact assessor

C143: Alternative composition suggester

C144: Rule-break justification speculator

C2: Identify focal points

C21: Primary focus determination

C211: Eye-tracking simulator

C212: Contrast area highlighter

C213: Detail density mapper

C214: Directional cue tracer

C22: Secondary focus identification

C221: Supporting element locator

C222: Secondary contrast analyzer

C223: Subtle detail enhancer

C224: Implied focal point finder

C23: Eye movement path tracking

C231: Viewing sequence predictor

C232: Attention duration estimator

C233: Re-examination point identifier

C234: Visual flow mapper

C24: Focal point balance assessment

C241: Weight distribution calculator

C242: Focal point hierarchy establisher

C243: Balance-to-imbalance ratio measurer

C244: Dynamic equilibrium analyzer

C3: Examine balance and symmetry

C31: Symmetry axis identification

C311: Vertical symmetry detector

C312: Horizontal symmetry analyzer

C313: Radial symmetry recognizer

C314: Asymmetrical balance assessor

C32: Weight distribution analysis

C321: Visual mass calculator

C322: Counterbalance element finder

C323: Tension point mapper

C324: Balance equilibrium grapher

C33: Asymmetrical balance check

C331: Off-center weight distributor

C332: Dynamic imbalance measurer

C333: Intentional imbalance detector

C334: Asymmetry appeal rater

C34: Dynamic vs. static balance evaluation

C341: Movement implication analyzer

C342: Stability vs. instability assessor

C343: Energy flow tracer

C344: Compositional rhythm detector

C4: Analyze use of lines and shapes

C41: Leading line identification

C411: Directional force mapper

C412: Implied line tracer

C413: Eye-guide strength assessor

C414: Converging line analyzer

C42: Geometric shape recognition

C421: Basic shape detector

C422: Complex geometry analyzer

C423: Hidden geometry revealer

C424: Shape symbolism interpreter

C43: Organic vs. inorganic form analysis

C431: Natural form identifier

C432: Artificial structure recognizer

C433: Form contrast measurer

C434: Organic-inorganic balance assessor

C44: Line direction and flow examination

C441: Horizontal line impact analyzer

C442: Vertical line strength measurer

C443: Diagonal dynamism assessor

C444: Curved line flow tracer

P: Palette Examination

P1: Identify dominant colors

P11: Color extraction tool application

P111: Primary color isolator

P112: Secondary color detector

P113: Accent color identifier

P114: Color proportion calculator

P12: Color percentage calculation

P121: Major color area measurer

P122: Minor color influence assessor

P123: Color distribution mapper

P124: Pixel-by-pixel color counter

P13: Warm vs. cool color balance

P131: Temperature scale generator

P132: Warm-cool ratio calculator

P133: Temperature contrast measurer

P134: Mood-temperature correlator

P14: Neutral tone identification

P141: Grayscale converter

P142: Neutral undertone detector

P143: Color-neutralizing element finder

P144: Neutral balance assessor

P2: Analyze color harmony

P21: Color wheel placement

P211: Primary color relationship mapper

P212: Secondary color interaction analyzer

P213: Tertiary color influence assessor

P214: Color wheel position visualizer

P22: Complementary color check

P221: Direct complement finder

P222: Split-complement analyzer

P223: Near-complement detector

P224: Complementary contrast measurer

P23: Analogous color identification

P231: Adjacent color range definer

P232: Analogous harmony assessor

P233: Analogous dominance detector

P234: Analogous mood interpreter

P24: Triadic color scheme analysis

P241: Equidistant triad locator

P242: Triadic balance calculator

P243: Triadic tension measurer

P244: Triadic harmony evaluator

P3: Explore color symbolism

P31: Cultural color meaning research

P311: Western color symbolism analyzer

P312: Eastern color significance detector

P313: Cross-cultural color meaning comparer

P314: Historical color usage researcher

P32: Emotional impact assessment

P321: Color-emotion correlator

P322: Mood board generator

P323: Emotional intensity scale

P324: Conflicting emotion color detector

P33: Genre-specific color use analysis

P331: Film genre color palette matcher

P332: Art movement color scheme identifier

P333: Literary genre color association finder

P334: Musical genre color synesthesia analyzer

P34: Brand color alignment check

P341: Corporate color scheme matcher

P342: Brand personality color assessor

P343: Industry-specific color trend analyzer

P344: Color-brand recognition tester

P4: Suggest alternative color schemes

P41: Complementary scheme generation

P411: Direct complement shifter

P412: Split-complement scheme creator

P413: Tetradic color arrangement suggester

P414: Complementary harmony optimizer

P42: Monochromatic variation creation

P421: Single hue shade generator

P422: Tint and tone explorer

P423: Monochromatic contrast enhancer

P424: Monochromatic depth creator

P43: Season-inspired palette suggestion

P431: Spring freshness color picker

P432: Summer vibrancy scheme creator

P433: Autumn warmth palette generator

P434: Winter coolness tone selector

P44: Mood-altering color shift proposal

P441: Energizing color boost recommender

P442: Calming hue shifter

P443: Dramatic color intensifier

P444: Nostalgic tone filter applier

Use these hotkeys to navigate through different aspects of your analysis and prompt creation process. Each hotkey represents a specific function or area of focus, allowing for a detailed and comprehensive approach to image analysis and prompt engineering. Provide me with the hotkeys you have selected from the ones mentioned above and explain a little why you have decided to use those hotkeys.`
  };
