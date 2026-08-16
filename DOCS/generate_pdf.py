import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def build_pdf(filename="CreatorOS_Executive_Summary_and_Architecture.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#000000")
    YELLOW = colors.HexColor("#FFDE59")
    CYAN = colors.HexColor("#00E5FF")
    LIME = colors.HexColor("#A3E635")
    PINK = colors.HexColor("#FF90E8")
    DARK_BG = colors.HexColor("#1A1A1A")
    LIGHT_BG = colors.HexColor("#F4F4F0")
    TEXT_DARK = colors.HexColor("#111111")
    TEXT_MUTED = colors.HexColor("#444444")

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.white,
        alignment=TA_LEFT
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=YELLOW,
        alignment=TA_LEFT
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=PRIMARY,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    badge_style = ParagraphStyle(
        'BadgeText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=PRIMARY,
        alignment=TA_CENTER
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=PRIMARY
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=TEXT_DARK
    )

    story = []

    # --- HEADER BANNER ---
    header_data = [
        [
            Paragraph("<b>CREATOROS</b>", title_style),
            Paragraph("HACKATHON SUBMISSION AUDIT & TECHNICAL SPECIFICATION", subtitle_style)
        ],
        [
            Paragraph("Autonomous Content Repurposing Pipeline & Postiz Distribution Engine", ParagraphStyle('HSub', fontName='Helvetica-Bold', fontSize=10, textColor=colors.white, leading=12)),
            Paragraph("Version 1.0 (MVP) • GitHub: GurukantPatil01/CreatorOs", ParagraphStyle('HSub2', fontName='Helvetica', fontSize=8.5, textColor=LIME, leading=10, alignment=TA_RIGHT))
        ]
    ]

    header_table = Table(header_data, colWidths=[3.5*inch, 3.8*inch])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), DARK_BG),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,1), (-1,1), 10),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))

    # --- SECTION 1: EXECUTIVE SUMMARY ---
    story.append(Paragraph("1. EXECUTIVE SUMMARY & VALUE PROPOSITION", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))

    summary_text = (
        "<b>CreatorOS</b> solves the single largest operational bottleneck facing digital creators, marketing teams, "
        "and developer advocates: <b>the content distribution velocity problem</b>. While producing a high-quality video "
        "takes effort, manually retyping captions, extracting viral hooks, rendering visual banners, and scheduling posts "
        "across fragmented social networks consumes an additional <b>5 to 10 hours per week</b>."
    )
    story.append(Paragraph(summary_text, body_style))

    # 3 Key Value Props Boxes
    kvp_data = [
        [
            Paragraph("<b>Sub-Second AI Extraction</b><br/>Groq Whisper V3 & Llama 3.3 70B transcribe speech and generate 12 tailored social posts instantly.", body_style),
            Paragraph("<b>Visual Pipeline Tracking</b><br/>Interactive @xyflow/react node graph displays live pipeline states from upload to publishing.", body_style),
            Paragraph("<b>Postiz Multi-Channel Sync</b><br/>1-click automated social queueing across Bluesky, LinkedIn, Instagram, and Mastodon.", body_style),
        ]
    ]
    kvp_table = Table(kvp_data, colWidths=[2.4*inch, 2.4*inch, 2.4*inch])
    kvp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), YELLOW),
        ('BACKGROUND', (1,0), (1,0), CYAN),
        ('BACKGROUND', (2,0), (2,0), LIME),
        ('BOX', (0,0), (0,0), 1.5, PRIMARY),
        ('BOX', (1,0), (1,0), 1.5, PRIMARY),
        ('BOX', (2,0), (2,0), 1.5, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(kvp_table)
    story.append(Spacer(1, 12))

    # --- SECTION 2: ARCHITECTURE & PIPELINE FLOW ---
    story.append(Paragraph("2. TECHNICAL PIPELINE ARCHITECTURE", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))

    pipe_data = [
        [Paragraph("Stage", table_header_style), Paragraph("Component / Technology", table_header_style), Paragraph("Execution Logic & Description", table_header_style)],
        [Paragraph("1. Ingestion", table_body_style), Paragraph("Next.js 16 / Supabase Storage", table_body_style), Paragraph("Accepts MP4/MOV video upload or raw topic prompt. Stores raw asset in Supabase bucket.", table_body_style)],
        [Paragraph("2. Transcription", table_body_style), Paragraph("Groq Whisper V3", table_body_style), Paragraph("Sub-second audio extraction and speech-to-text conversion into structured transcript text.", table_body_style)],
        [Paragraph("3. AI Extraction", table_body_style), Paragraph("Groq Llama 3.3 70B", table_body_style), Paragraph("Contextual analysis extracting core summary, target tone, viral hooks, hashtags, and CTAs.", table_body_style)],
        [Paragraph("4. Multi-Asset Gen", table_body_style), Paragraph("Groq JSON Schema Parser", table_body_style), Paragraph("Generates 12 platform-native post variations for Instagram, LinkedIn, and Bluesky.", table_body_style)],
        [Paragraph("5. Visual Review", table_body_style), Paragraph("Neo-Brutalist Stepper UI", table_body_style), Paragraph("Interactive content review cards with inline text editor & custom Thumbnail Creator canvas.", table_body_style)],
        [Paragraph("6. Distribution", table_body_style), Paragraph("Postiz API Integration", table_body_style), Paragraph("1-click automated social dispatch and queueing with status updates on @xyflow/react graph.", table_body_style)],
    ]
    pipe_table = Table(pipe_data, colWidths=[1.1*inch, 2.0*inch, 4.2*inch])
    pipe_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), YELLOW),
        ('GRID', (0,0), (-1,-1), 1, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(pipe_table)
    story.append(Spacer(1, 12))

    # PAGE BREAK FOR CLEAN 2-PAGE LAYOUT
    story.append(PageBreak())

    # --- SECTION 3: TECH STACK MATRIX ---
    story.append(Paragraph("3. SYSTEM TECHNOLOGY STACK MATRIX", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))

    stack_data = [
        [Paragraph("Layer", table_header_style), Paragraph("Technology", table_header_style), Paragraph("Purpose & Impact", table_header_style)],
        [Paragraph("Frontend Framework", table_body_style), Paragraph("Next.js 16 (App Router), React 19, TypeScript", table_body_style), Paragraph("High-performance server rendering, strict type safety, and modern client hooks.", table_body_style)],
        [Paragraph("Styling & UX", table_body_style), Paragraph("Tailwind CSS 4, Lucide Icons, Framer Motion", table_body_style), Paragraph("Custom Neo-Brutalist design system delivering high-contrast visual identity and engagement.", table_body_style)],
        [Paragraph("Visual Graph", table_body_style), Paragraph("@xyflow/react (React Flow v12)", table_body_style), Paragraph("Interactive execution node graph displaying real-time campaign processing states.", table_body_style)],
        [Paragraph("AI Inference", table_body_style), Paragraph("Groq API (Llama 3.3 70B & Whisper V3)", table_body_style), Paragraph("Ultra-fast LLM text extraction and speech transcription with JSON format enforcement.", table_body_style)],
        [Paragraph("Publishing Provider", table_body_style), Paragraph("Postiz API / Custom Postiz Provider Adapter", table_body_style), Paragraph("Open-source multi-channel social posting integration with automatic mock fallback.", table_body_style)],
        [Paragraph("Database & Auth", table_body_style), Paragraph("Supabase PostgreSQL (@supabase/ssr)", table_body_style), Paragraph("Relational data storage for campaigns, scheduled posts, and media file references.", table_body_style)],
    ]
    stack_table = Table(stack_data, colWidths=[1.5*inch, 2.3*inch, 3.5*inch])
    stack_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), CYAN),
        ('GRID', (0,0), (-1,-1), 1, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(stack_table)
    story.append(Spacer(1, 12))

    # --- SECTION 4: DEMO RESILIENCE & JUDGING HIGHLIGHTS ---
    story.append(Paragraph("4. DEMO RESILIENCE & JUDGING HIGHLIGHTS", h1_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceAfter=8))

    story.append(Paragraph("<b>Built-in Fallback Infrastructure:</b>", h2_style))
    story.append(Paragraph("• <b>Zero Key Dependency:</b> To guarantee flawless live judging evaluations, CreatorOS contains graceful mock fallback providers for both Groq AI and Postiz API endpoints. Judges can test all UI flows instantly even if external API limits occur.", bullet_style))
    story.append(Paragraph("• <b>Strict Data Schema Integrity:</b> All API route outputs validate JSON response objects using TypeScript interfaces, preventing schema drift during generation.", bullet_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Verification & Code Quality:</b>", h2_style))
    story.append(Paragraph("• <b>Clean GitHub Repository:</b> Fully committed, structured codebase with initial database migrations under <code>supabase/migrations/</code>.", bullet_style))
    story.append(Paragraph("• <b>Zero Placeholder UI:</b> Fully styled, high-energy interfaces across Dashboard, Campaign Stepper, Thumbnail Creator, Calendar, and Analytics views.", bullet_style))

    story.append(Spacer(1, 14))

    # FOOTER BOX
    footer_data = [
        [
            Paragraph("<b>CreatorOS Hackathon Submission Package</b><br/>Submitted for Devpost Hackathon Judging • Repository: <b>https://github.com/GurukantPatil01/CreatorOs.git</b>", ParagraphStyle('Foot', fontName='Helvetica', fontSize=8, leading=10, textColor=PRIMARY, alignment=TA_CENTER))
        ]
    ]
    footer_table = Table(footer_data, colWidths=[7.3*inch])
    footer_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, PRIMARY),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(footer_table)

    doc.build(story)
    print("PDF generated successfully:", filename)

if __name__ == '__main__':
    build_pdf()
