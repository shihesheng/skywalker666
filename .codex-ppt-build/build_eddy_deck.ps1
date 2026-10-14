param(
  [Parameter(Mandatory = $true)]
  [string]$OutputPath,
  [Parameter(Mandatory = $true)]
  [string]$PreviewDir
)

$ErrorActionPreference = 'Stop'

$W = 960
$H = 540
$BG = 0x090908
$BG2 = 0x111210
$WHITE = 0xF2F0E9
$MUTED = 0x97978F
$ORANGE = 0x1F5AFF
$DARK = 0x121313
$SLIDE_W = $W
$SLIDE_H = $H
$MsoTrue = -1
$MsoFalse = 0
$PpLayoutBlank = 12
$PpSaveAsOpenXMLPresentation = 24
$PpEffectFadeSmoothly = 3849
$PpEffectMorphByObject = 3954
$MsoAnimEffectFade = 10
$MsoAnimEffectZoom = 23
$MsoAnimTriggerAfterPrevious = 3

function RGB([int]$r, [int]$g, [int]$b) { return ($r + ($g * 256) + ($b * 65536)) }

function Set-Background($slide, [int]$color) {
  $slide.FollowMasterBackground = $MsoFalse
  $slide.Background.Fill.Solid()
  $slide.Background.Fill.ForeColor.RGB = $color
}

function Add-Rect($slide, [double]$x, [double]$y, [double]$w, [double]$h, [int]$fill, [double]$transparency = 0, [double]$radius = 0) {
  $type = if ($radius -gt 0) { 5 } else { 1 }
  $shape = $slide.Shapes.AddShape($type, $x, $y, $w, $h)
  $shape.Line.Visible = $MsoFalse
  $shape.Fill.Solid()
  $shape.Fill.ForeColor.RGB = $fill
  $shape.Fill.Transparency = $transparency
  return $shape
}

function Add-Line($slide, [double]$x1, [double]$y1, [double]$x2, [double]$y2, [int]$color, [double]$width = 1, [double]$transparency = 0) {
  $line = $slide.Shapes.AddLine($x1, $y1, $x2, $y2)
  $line.Line.ForeColor.RGB = $color
  $line.Line.Weight = $width
  $line.Line.Transparency = $transparency
  return $line
}

function Add-Text(
  $slide, [string]$text, [double]$x, [double]$y, [double]$w, [double]$h,
  [double]$size, [int]$color, [bool]$bold = $false, [string]$font = 'Microsoft YaHei',
  [int]$align = 1, [bool]$italic = $false, [double]$spacing = 0
) {
  $shape = $slide.Shapes.AddTextbox(1, $x, $y, $w, $h)
  $shape.Line.Visible = $MsoFalse
  $shape.Fill.Visible = $MsoFalse
  $shape.TextFrame.MarginLeft = 0
  $shape.TextFrame.MarginRight = 0
  $shape.TextFrame.MarginTop = 0
  $shape.TextFrame.MarginBottom = 0
  $shape.TextFrame.WordWrap = $MsoTrue
  $shape.TextFrame.AutoSize = 0
  $shape.TextFrame.VerticalAnchor = 1
  $shape.TextFrame.TextRange.Text = $text
  $shape.TextFrame.TextRange.Font.Name = $font
  try { $shape.TextFrame.TextRange.Font.NameFarEast = 'Microsoft YaHei' } catch {}
  $shape.TextFrame.TextRange.Font.Size = $size
  $shape.TextFrame.TextRange.Font.Color.RGB = $color
  $shape.TextFrame.TextRange.Font.Bold = if ($bold) { $MsoTrue } else { $MsoFalse }
  $shape.TextFrame.TextRange.Font.Italic = if ($italic) { $MsoTrue } else { $MsoFalse }
  $shape.TextFrame.TextRange.ParagraphFormat.Alignment = $align
  if ($spacing -ne 0) { try { $shape.TextFrame2.TextRange.Font.Spacing = $spacing } catch {} }
  return $shape
}

function Add-PictureFill($slide, [string]$path, [double]$x, [double]$y, [double]$w, [double]$h, [double]$rotation = 0, [bool]$shadow = $true, [double]$radius = 8) {
  $shape = Add-Rect $slide $x $y $w $h (RGB 32 33 31) 0 $radius
  $shape.Fill.UserPicture($path)
  $shape.Rotation = $rotation
  if ($shadow) {
    try {
      $shape.Shadow.Visible = $MsoTrue
      $shape.Shadow.ForeColor.RGB = (RGB 0 0 0)
      $shape.Shadow.Transparency = 0.45
      $shape.Shadow.Blur = 12
      $shape.Shadow.OffsetX = 4
      $shape.Shadow.OffsetY = 7
    } catch {}
  }
  return $shape
}

function Add-ImageLabel($slide, [string]$label, [double]$x, [double]$y, [double]$w) {
  return Add-Text $slide $label $x $y $w 20 8 (RGB 205 204 196) $true 'Arial' 1 $false 1.6
}

function Add-Footer($slide, [int]$index, [string]$section) {
  Add-Line $slide 48 505 912 505 (RGB 55 56 53) 0.75 0 | Out-Null
  Add-Text $slide $section 48 512 360 14 7 (RGB 113 113 107) $true 'Arial' 1 $false 1.4 | Out-Null
  Add-Text $slide (('{0:D2}' -f $index)) 860 512 52 14 7 (RGB 113 113 107) $true 'Arial' 3 $false 1.4 | Out-Null
}

function Set-Transition($slide, [bool]$morph = $false) {
  try {
    $slide.SlideShowTransition.EntryEffect = if ($morph) { $PpEffectMorphByObject } else { $PpEffectFadeSmoothly }
    $slide.SlideShowTransition.Speed = 2
    $slide.SlideShowTransition.AdvanceOnClick = $MsoTrue
  } catch {
    try { $slide.SlideShowTransition.EntryEffect = $PpEffectFadeSmoothly } catch {}
  }
}

function Animate($slide, $shape, [bool]$zoom = $false, [double]$delay = 0) {
  try {
    $effectId = if ($zoom) { $MsoAnimEffectZoom } else { $MsoAnimEffectFade }
    $effect = $slide.TimeLine.MainSequence.AddEffect($shape, $effectId, 0, $MsoAnimTriggerAfterPrevious)
    $effect.Timing.Duration = if ($zoom) { 0.7 } else { 0.45 }
    $effect.Timing.TriggerDelayTime = $delay
  } catch {}
}

function New-Slide($pres, [int]$bgColor = $BG, [bool]$morph = $false) {
  $slide = $pres.Slides.Add($pres.Slides.Count + 1, $PpLayoutBlank)
  Set-Background $slide $bgColor
  Set-Transition $slide $morph
  return $slide
}

function Add-Kicker($slide, [string]$text, [int]$color = $ORANGE) {
  return Add-Text $slide $text 48 34 420 20 9 $color $true 'Arial' 1 $false 2.2
}

function Add-EventSlide($pres, [hashtable]$event, [int]$slideIndex) {
  $slide = New-Slide $pres $BG $false
  Add-Kicker $slide ($event.id + ' / SIX MOMENTS · ONE STORY') | Out-Null
  $rightText = ($slideIndex % 2 -eq 0)
  if ($rightText) {
    $tx = 570; $ix = 48
  } else {
    $tx = 48; $ix = 410
  }
  $ghost = Add-Text $slide $event.id ($tx - 10) 52 340 150 112 (RGB 27 28 27) $true 'Arial' 1
  $title = Add-Text $slide $event.title $tx 86 350 70 42 $WHITE $true 'Microsoft YaHei' 1
  $english = Add-Text $slide $event.english $tx 154 350 34 22 $ORANGE $false 'Georgia' 1 $true
  $body = Add-Text $slide ($event.body -join "`r`n") $tx 212 330 122 15 (RGB 180 179 172) $false 'Microsoft YaHei' 1
  Animate $slide $title $false 0
  Animate $slide $english $false 0.05
  Animate $slide $body $false 0.1

  $imgs = $event.images
  if ($imgs.Count -eq 1) {
    $pic = Add-PictureFill $slide $imgs[0] $ix 105 455 330 0 $true 8
    Animate $slide $pic $true 0.15
  } elseif ($imgs.Count -eq 2) {
    $pic1 = Add-PictureFill $slide $imgs[0] $ix 84 420 292 0 $true 8
    $pic2 = Add-PictureFill $slide $imgs[1] ($ix + 252) 300 255 166 -1.8 $true 8
    Add-Rect $slide ($ix + 333) 289 72 18 $ORANGE 0.08 0 | Out-Null
    Animate $slide $pic1 $true 0.12
    Animate $slide $pic2 $true 0.22
  } else {
    $pic1 = Add-PictureFill $slide $imgs[0] $ix 82 360 270 -1.2 $true 8
    $pic2 = Add-PictureFill $slide $imgs[1] ($ix + 225) 255 265 182 1.5 $true 8
    $pic3 = Add-PictureFill $slide $imgs[2] ($ix + 44) 348 245 128 -0.7 $true 8
    Add-Rect $slide ($ix + 300) 245 70 18 $ORANGE 0.08 0 | Out-Null
    Animate $slide $pic1 $true 0.1
    Animate $slide $pic2 $true 0.2
    Animate $slide $pic3 $true 0.3
  }
  if ($event.keywords.Count -gt 0) {
    Add-Text $slide ($event.keywords -join '   /   ') $tx 366 340 20 8 (RGB 127 127 121) $true 'Arial' 1 $false 1.4 | Out-Null
  }
  if ($event.annotation) {
    Add-Text $slide $event.annotation 760 454 150 28 17 $WHITE $false 'Segoe Print' 3 $true | Out-Null
  }
  Add-Footer $slide $slideIndex 'MY JOURNEY'
  return $slide
}

function Add-MeaningSlide($pres, [hashtable]$chapter, [int]$slideIndex, [int]$stage) {
  $slide = New-Slide $pres $BG $true
  Add-Kicker $slide ('03 / WHAT IT MEANS · ' + $chapter.id) | Out-Null
  Add-Text $slide $chapter.english 36 56 220 390 76 (RGB 27 28 27) $false 'Arial' 1 $false -1 | ForEach-Object { $_.Rotation = -90 } | Out-Null

  $centerX = 330; $centerY = 265
  if ($stage -eq 1) {
    Add-Line $slide 170 360 480 150 $ORANGE 2 0 | Out-Null
    $nodes = @(@(170,360,58,'01'),@(480,150,78,'02'))
  } elseif ($stage -eq 2) {
    Add-Line $slide 150 175 340 275 $ORANGE 1.8 0 | Out-Null
    Add-Line $slide 340 275 520 365 $ORANGE 1.8 0 | Out-Null
    $nodes = @(@(150,175,64,'01'),@(340,275,74,'02'),@(520,365,64,'03'))
  } elseif ($stage -eq 3) {
    Add-Line $slide 245 410 350 275 $ORANGE 1.7 0 | Out-Null
    Add-Line $slide 350 275 470 125 $ORANGE 1.7 0 | Out-Null
    Add-Line $slide 260 430 485 105 (RGB 37 38 36) 1.2 0 | Out-Null
    $nodes = @(@(245,410,54,'01'),@(350,275,68,'02'),@(470,125,82,'03'))
  } else {
    $ring = $slide.Shapes.AddShape(9, 115, 103, 455, 315)
    $ring.Fill.Visible = $MsoFalse
    $ring.Line.ForeColor.RGB = $ORANGE
    $ring.Line.Weight = 2
    $ring.Line.Transparency = 0.2
    $ring.Rotation = 12
    $ring2 = $slide.Shapes.AddShape(9, 170, 150, 345, 220)
    $ring2.Fill.Visible = $MsoFalse
    $ring2.Line.ForeColor.RGB = (RGB 55 56 53)
    $ring2.Line.Weight = 1
    $ring2.Rotation = -15
    $nodes = @(@(342,255,92,'04'))
  }
  foreach ($node in $nodes) {
    $circle = $slide.Shapes.AddShape(9, ($node[0] - $node[2]/2), ($node[1] - $node[2]/2), $node[2], $node[2])
    $circle.Fill.Solid(); $circle.Fill.ForeColor.RGB = (RGB 24 25 24); $circle.Fill.Transparency = 0.02
    $circle.Line.ForeColor.RGB = (RGB 72 73 69); $circle.Line.Weight = 1.1
    Add-Text $slide $node[3] ($node[0]-22) ($node[1]-10) 44 20 11 $WHITE $true 'Arial' 2 $false 1.3 | Out-Null
    Add-Rect $slide ($node[0]+($node[2]/3)) ($node[1]-($node[2]/3)) 7 7 $ORANGE 0 8 | Out-Null
  }
  $title = Add-Text $slide $chapter.title 620 95 290 70 42 $WHITE $true 'Microsoft YaHei' 1
  Add-Text $slide $chapter.english 620 168 290 24 14 $ORANGE $false 'Georgia' 1 $true | Out-Null
  Add-Text $slide ($chapter.body -join "`r`n") 620 223 290 114 15 (RGB 181 180 173) $false 'Microsoft YaHei' 1 | Out-Null
  Add-Text $slide $chapter.statement 620 365 290 65 19 $WHITE $false 'Georgia' 1 $true | Out-Null
  Animate $slide $title $false 0.05
  Add-Footer $slide $slideIndex 'WHAT IT MEANS'
  return $slide
}

function Add-PlanSlide($pres, [hashtable]$plan, [int]$slideIndex) {
  $bgColor = if ([int]$plan.id % 2 -eq 0) { (RGB 238 235 226) } else { $BG }
  $textColor = if ([int]$plan.id % 2 -eq 0) { (RGB 16 17 16) } else { $WHITE }
  $mutedColor = if ([int]$plan.id % 2 -eq 0) { (RGB 83 83 79) } else { (RGB 180 179 172) }
  $ghostColor = if ([int]$plan.id % 2 -eq 0) { (RGB 218 214 204) } else { (RGB 27 28 27) }
  $ruleColor = if ([int]$plan.id % 2 -eq 0) { (RGB 186 181 170) } else { (RGB 52 53 50) }
  $slide = New-Slide $pres $bgColor $true
  Add-Text $slide ('0' + $plan.id) 610 34 330 190 132 $ghostColor $true 'Arial' 3 | Out-Null
  Add-Text $slide ('PLAN ' + $plan.id) 58 58 200 18 9 $ORANGE $true 'Arial' 1 $false 2.1 | Out-Null
  $title = Add-Text $slide $plan.title 58 111 535 62 38 $textColor $true 'Microsoft YaHei' 1
  Add-Text $slide $plan.english 58 178 535 28 18 $ORANGE $false 'Georgia' 1 $true | Out-Null
  Add-Text $slide ($plan.body -join "`r`n") 58 242 510 102 16 $mutedColor $false 'Microsoft YaHei' 1 | Out-Null
  Add-Line $slide 58 372 570 372 $ruleColor 1 0 | Out-Null
  Add-Text $slide $plan.statement 58 397 530 46 23 $textColor $false 'Georgia' 1 $true | Out-Null
  if ($plan.notes.Count -gt 0) {
    $noteText = $plan.notes -join "`r`n"
    Add-Text $slide $noteText 660 248 245 185 14 $mutedColor $false 'Microsoft YaHei' 1 | Out-Null
  }
  Animate $slide $title $false 0.05
  Add-Footer $slide $slideIndex "WHAT'S NEXT"
  return $slide
}

$project = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$imageDir = Join-Path $project 'public\images'
$portfolio = 1..12 | ForEach-Object {
  $num = '{0:D2}' -f $_
  $png = Join-Path $imageDir ("portfolio-$num.png")
  $jpg = Join-Path $imageDir ("portfolio-$num.jpg")
  if (Test-Path $png) { $png } else { $jpg }
}

$events = @(
  @{ id='01'; title='端午节'; english='Dragon Boat Festival'; body=@('第一次真正走进外联的活动现场，也是在这里开始理解：一场活动最终呈现出来的热闹，背后其实是很多细节共同完成的。'); keywords=@(); annotation='the beginning'; images=@((Join-Path $imageDir 'dragon-boat-01.jpg'),(Join-Path $imageDir 'dragon-boat-02.jpg')) },
  @{ id='02'; title='全员加速中'; english='Run together.'; body=@('相比单纯完成自己的任务，这次活动让我更明显地感受到团队之间的配合。现场节奏很快，每个人都需要知道自己什么时候出现、什么时候补位。'); keywords=@('COORDINATION','REACTION','TEAMWORK'); images=@((Join-Path $imageDir 'run-together-01.jpg'),(Join-Path $imageDir 'run-together-02.jpg')) },
  @{ id='03'; title='期末加油包'; english='A small thing, at the right time.'; body=@('外联并不一定只存在于大型活动里。有时候，一个很小的活动，也能让社团和同学之间产生真正的连接。','这也让我开始意识到，活动的价值不一定取决于规模，而在于它有没有回应大家当下真正需要的东西。'); keywords=@('WARM','SMALL DETAILS','HUMAN CONNECTION'); images=@((Join-Path $imageDir 'finals-kit-01.jpg'),(Join-Path $imageDir 'finals-kit-02.jpg')) },
  @{ id='04'; title='Launch Week'; english='Communication in motion.'; body=@('Launch Week 让我看到，一个活动真正对外呈现时，现场体验、信息传达和整体氛围其实是连在一起的。','外联也不只是“找到资源”，而是在不同的人、信息和需求之间建立连接。'); keywords=@('COMMUNICATION','PRESENCE','CONNECTION'); images=@((Join-Path $imageDir 'launch-week-01.jpg'),(Join-Path $imageDir 'launch-week-02.jpg')) },
  @{ id='05'; title='Welcome Party'; english='People make the event.'; body=@('Welcome Party 是我很喜欢的一类活动，因为它让我看到社团最有生命力的一面。','大家从陌生到熟悉，也让我越来越确定：一个好的活动，不只是把流程完成，而是真的创造一个让人愿意留下来的环境。'); keywords=@(); images=@((Join-Path $imageDir 'welcome-party-01.jpg'),(Join-Path $imageDir 'welcome-party-02.jpg'),(Join-Path $imageDir 'welcome-party-03.jpg')) },
  @{ id='06'; title='紫金宣讲'; english='From campus to outside.'; body=@('如果说前面的活动更多让我认识了社团内部的连接，那么宣讲活动让我进一步接触到外联更核心的一面——社团和外部资源之间的连接。','如何沟通、如何理解双方需求、如何让一次合作真正对彼此有价值，是我觉得外联最值得学习的地方。'); keywords=@(); images=@((Join-Path $imageDir 'zijin-talk-01.jpg')) }
)

$meaning = @(
  @{id='01'; title='沟通'; english='Communication'; body=@('外联首先是沟通，但我理解的沟通并不是单纯“把话说出去”。','更重要的是知道对方在意什么、我们需要什么，以及如何找到双方都愿意继续合作的交集。'); statement='Listen first. Then connect.'},
  @{id='02'; title='连接'; english='Connection'; body=@('资源本身不会自动变成价值。','外联真正需要做的，是判断什么资源适合什么活动，再把合适的人、合作方和需求连接起来。'); statement='The right connection matters more than more connections.'},
  @{id='03'; title='落地'; english='Execution'; body=@('一个合作从想法到真正发生，中间还有很多细节。','确认信息、沟通时间、协调现场、处理变化，这些看起来不显眼的事情，往往决定了一次合作最后是不是顺利。'); statement='Ideas only matter when they land.'},
  @{id='04'; title='责任'; english='Responsibility'; body=@('如果成为副部，我觉得角色会从“完成自己的部分”变成“让整个团队更容易把事情做好”。','除了做好自己的工作，也需要帮助新人进入状态、承担沟通成本、及时补位，并把经验真正留下来。'); statement='Make the team better, not just myself busier.'}
)

$plans = @(
  @{id='01'; title='让经验留下来'; english='Build a shared memory.'; body=@('很多外联经验其实都存在于人的记忆里。','谁联系过什么合作方、什么沟通方式有效、活动哪里容易出问题，如果每一次都重新摸索，会浪费很多时间。'); statement="Don't start from zero every time."; notes=@('合作方信息','历史合作情况','联系方式','沟通记录','活动复盘','注意事项')},
  @{id='02'; title='让新人更快进入状态'; english='Make the first step easier.'; body=@('刚进入外联的时候，很多事情其实并不知道应该怎么开始。','我希望以后可以把常见的沟通方式、合作流程和活动经验整理得更清楚，让新人不用靠猜，也不用因为第一次做就害怕犯错。'); statement='We know what to do.'; notes=@('How do I contact them?','What should I say?','What happens next?')},
  @{id='03'; title='让合作更长期'; english='Think beyond one event.'; body=@('一次活动结束，不一定意味着一次合作结束。','如果双方合作体验很好，我希望能够主动维护这些关系，让好的合作慢慢从一次性的联系变成长期的连接。'); statement='Good relationships compound.'; notes=@('one event','follow up','shared value','long-term connection')},
  @{id='04'; title='让外联更有参与感'; english='Make people want to be here.'; body=@('我希望外联不仅是一个完成任务的部门，也可以是一个大家愿意一起做事情、愿意表达想法、愿意承担责任的团队。','如果成为副部，我希望自己既能在需要的时候站出来，也能给其他人足够的空间去尝试。'); statement='Lead when needed. Step back when possible.'; notes=@()}
)

New-Item -ItemType Directory -Path (Split-Path -Parent $OutputPath) -Force | Out-Null
New-Item -ItemType Directory -Path $PreviewDir -Force | Out-Null
if (Test-Path $OutputPath) { Remove-Item -LiteralPath $OutputPath -Force }
Get-ChildItem -LiteralPath $PreviewDir -File -ErrorAction SilentlyContinue | Remove-Item -Force

$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = $MsoTrue
$pres = $ppt.Presentations.Add($MsoTrue)
$pres.PageSetup.SlideWidth = $W
$pres.PageSetup.SlideHeight = $H

try {
  # 01 — Cover
  $slide = New-Slide $pres $BG $false
  Add-Line $slide 48 42 610 42 (RGB 58 59 55) 1 0 | Out-Null
  Add-Text $slide 'UNSWCSA / 2026' 645 31 190 18 9 $MUTED $true 'Arial' 1 $false 2 | Out-Null
  Add-Text $slide 'UNSW · KENSINGTON' 760 31 150 18 8 $MUTED $true 'Arial' 3 $false 1.4 | Out-Null
  Add-Text $slide 'External Relations' 55 106 360 24 13 $ORANGE $true 'Arial' 1 $false 1.8 | Out-Null
  $cover1 = Add-Text $slide '外联副部' 51 136 650 110 72 $WHITE $true 'Microsoft YaHei' 1
  $cover2 = Add-Text $slide '竞选' 51 235 470 100 72 $ORANGE $true 'Microsoft YaHei' 1
  Add-Text $slide '2026' 570 120 355 205 145 (RGB 23 24 22) $true 'Arial' 3 $false -2 | Out-Null
  Add-Line $slide 55 408 495 408 (RGB 58 59 55) 1 0 | Out-Null
  Add-Text $slide 'UNSWCSA   /   DEPUTY HEAD CANDIDATE' 55 422 440 20 8 $MUTED $true 'Arial' 1 $false 1.8 | Out-Null
  Add-Text $slide 'Eddy 盛世禾' 710 395 200 44 22 $WHITE $false 'Segoe Print' 3 $true | Out-Null
  Animate $slide $cover1 $false 0
  Animate $slide $cover2 $false 0.12
  Add-Footer $slide 1 'COVER'

  # 02 — About opener
  $slide = New-Slide $pres $BG $false
  Add-Kicker $slide '01 / PERSONAL INTRODUCTION' | Out-Null
  Add-Text $slide 'PROFILE' 48 90 864 250 176 (RGB 23 24 22) $true 'Arial' 2 $false -4 | Out-Null
  $aboutTitle = Add-Text $slide '个人简介' 250 190 460 80 52 $WHITE $true 'Microsoft YaHei' 2
  Add-Text $slide 'A LITTLE MORE ABOUT ME.' 250 281 460 22 10 $MUTED $true 'Arial' 2 $false 2.4 | Out-Null
  Add-Text $slide '不止是几行自我介绍。' 250 342 460 30 20 $ORANGE $false 'Microsoft YaHei' 2 | Out-Null
  Animate $slide $aboutTitle $true 0
  Add-Footer $slide 2 'PERSONAL PROFILE'

  # 03 — About 01
  $slide = New-Slide $pres (RGB 239 236 226) $false
  Add-Text $slide '01' 48 34 80 18 9 (RGB 99 99 93) $true 'Arial' 1 $false 2 | Out-Null
  Add-Text $slide 'PERSONAL NOTE' 728 34 184 18 9 (RGB 99 99 93) $true 'Arial' 3 $false 2 | Out-Null
  Add-Text $slide '边做' 68 108 370 78 49 (RGB 16 17 16) $true 'Microsoft YaHei' 1 | Out-Null
  Add-Text $slide '边学.' 68 175 420 94 62 $ORANGE $false 'Microsoft YaHei' 1 | Out-Null
  Add-Text $slide '我是一名软件工程专业的大二学生。专业上，我比较喜欢“边做边学”。除了课程学习之外，也会主动参加一些项目和比赛，比如字节全栈挑战赛、安克创新黑客松。' 69 305 590 108 17 (RGB 62 62 58) $false 'Microsoft YaHei' 1 | Out-Null
  Add-Text $slide 'SOFTWARE ENGINEERING   /   LEARNING BY DOING   /   BYTEDANCE FULL-STACK CHALLENGE' 69 447 780 18 8 (RGB 107 106 100) $true 'Arial' 1 $false 1.3 | Out-Null
  Add-Footer $slide 3 'PERSONAL PROFILE'

  # 04 — About 02, orange remains orange
  $slide = New-Slide $pres $ORANGE $false
  Add-Text $slide '02' 48 34 80 18 9 (RGB 133 52 22) $true 'Arial' 1 $false 2 | Out-Null
  Add-Text $slide 'PERSONAL NOTE' 728 34 184 18 9 (RGB 133 52 22) $true 'Arial' 3 $false 2 | Out-Null
  Add-Text $slide '走出' 68 105 400 86 54 (RGB 15 17 16) $true 'Microsoft YaHei' 1 | Out-Null
  Add-Text $slide '舒适区.' 68 178 480 92 62 $WHITE $false 'Microsoft YaHei' 1 | Out-Null
  Add-Text $slide '平时我很喜欢运动，尤其是打羽毛球；也喜欢音乐，会弹一点钢琴、吹口琴。相比一直待在自己的舒适区里，我更喜欢尝试新东西、认识不同的人，也很享受和大家一起讨论、合作的过程。' 69 309 620 104 17 (RGB 69 37 24) $false 'Microsoft YaHei' 1 | Out-Null
  Add-Text $slide 'BADMINTON   /   PIANO   /   HARMONICA' 69 447 620 18 8 (RGB 134 53 22) $true 'Arial' 1 $false 1.5 | Out-Null
  Add-Footer $slide 4 'PERSONAL PROFILE'

  # 05 — About 03
  $slide = New-Slide $pres $BG2 $false
  Add-Text $slide '03' 48 34 80 18 9 (RGB 133 52 22) $true 'Arial' 1 $false 2 | Out-Null
  Add-Text $slide 'PERSONAL NOTE' 728 34 184 18 9 $MUTED $true 'Arial' 3 $false 2 | Out-Null
  Add-Text $slide '把想法' 68 105 500 86 54 $WHITE $true 'Microsoft YaHei' 1 | Out-Null
  Add-Text $slide '做出来.' 68 178 500 92 62 $ORANGE $false 'Microsoft YaHei' 1 | Out-Null
  Add-Text $slide '对我来说，参加这些活动不只是为了多一段经历，更重要的是能真正和团队一起做东西、解决问题，把脑子里的想法一点点落地。' 69 309 590 104 17 (RGB 177 176 169) $false 'Microsoft YaHei' 1 | Out-Null
  Add-Text $slide 'BYTEDANCE FULL-STACK CHALLENGE   /   ANKER HACKATHON' 69 447 670 18 8 $MUTED $true 'Arial' 1 $false 1.3 | Out-Null
  Add-Footer $slide 5 'PERSONAL PROFILE'

  # 06 — Portfolio orbit
  $slide = New-Slide $pres $BG $true
  Add-Kicker $slide 'SELECTED WORK & EVIDENCE' | Out-Null
  Add-Text $slide 'PORTFOLIO' 270 218 420 72 48 $WHITE $true 'Arial' 2 $false 1.6 | Out-Null
  Add-Text $slide 'CONTRACTS · PROJECTS · RESEARCH' 270 294 420 20 9 $MUTED $true 'Arial' 2 $false 2 | Out-Null
  $cx=480; $cy=285; $rx=355; $ry=192
  for ($i=0; $i -lt $portfolio.Count; $i++) {
    $angle = (-160 + ($i * (320.0 / 11.0)))
    $rad = $angle * [Math]::PI / 180
    $x = $cx + $rx * [Math]::Cos($rad) - 43
    $y = $cy + $ry * [Math]::Sin($rad) - 57
    $rot = ($angle + 90) * 0.22
    $card = Add-PictureFill $slide $portfolio[$i] $x $y 86 114 $rot $true 8
    Animate $slide $card $true ($i * 0.03)
  }
  Add-Footer $slide 6 'PORTFOLIO'

  # 07 — Journey opener
  $slide = New-Slide $pres $BG $false
  Add-Kicker $slide '02 / MY JOURNEY' | Out-Null
  Add-Text $slide 'MY JOURNEY' 48 92 864 210 132 (RGB 24 25 23) $true 'Arial' 2 $false -3 | Out-Null
  $journeyTitle = Add-Text $slide '我与外联' 225 180 510 80 54 $WHITE $true 'Microsoft YaHei' 2
  Add-Text $slide 'Somewhere between every event, I found my place here.' 180 275 600 30 19 $ORANGE $false 'Georgia' 2 $true | Out-Null
  Add-Text $slide '比起把它们写成一条条经历，我更愿意把这些活动理解成我和外联共同经历过的一些瞬间。' 215 346 530 54 16 (RGB 179 178 171) $false 'Microsoft YaHei' 2 | Out-Null
  Animate $slide $journeyTitle $true 0
  Add-Footer $slide 7 'MY JOURNEY'

  $slideNum = 8
  foreach ($event in $events) { Add-EventSlide $pres $event $slideNum | Out-Null; $slideNum++ }

  # 14 — Meaning opener
  $slide = New-Slide $pres $BG $false
  Add-Kicker $slide '03 / WHAT IT MEANS' | Out-Null
  Add-Text $slide 'CONNECTION' 42 75 880 240 126 (RGB 23 24 22) $true 'Arial' 2 $false -2 | Out-Null
  $meaningTitle = Add-Text $slide '我理解的外联' 218 180 525 80 52 $WHITE $true 'Microsoft YaHei' 2
  Add-Text $slide 'Not just reaching out.' 218 272 525 30 20 $ORANGE $false 'Georgia' 2 $true | Out-Null
  Add-Text $slide "经历过这些活动以后，我对外联的理解也慢慢发生了变化。`r`n它当然包括沟通、合作和资源，但我觉得真正重要的，是把人、资源和一场活动需要解决的问题连接起来。" 225 338 510 80 15 (RGB 179 178 171) $false 'Microsoft YaHei' 2 | Out-Null
  Animate $slide $meaningTitle $true 0
  Add-Footer $slide 14 'WHAT IT MEANS'

  $slideNum = 15
  for ($i=0; $i -lt $meaning.Count; $i++) { Add-MeaningSlide $pres $meaning[$i] $slideNum ($i+1) | Out-Null; $slideNum++ }

  # 19 — Future opener
  $slide = New-Slide $pres (RGB 238 235 226) $false
  Add-Text $slide '04 / WHAT''S NEXT' 48 34 300 18 9 $ORANGE $true 'Arial' 1 $false 2 | Out-Null
  Add-Text $slide 'NEXT' 515 30 405 250 172 (RGB 220 216 206) $true 'Arial' 3 $false -4 | Out-Null
  $futureTitle = Add-Text $slide '如果我成为副部' 66 124 650 80 48 (RGB 16 17 16) $true 'Microsoft YaHei' 1
  Add-Text $slide 'What I want to build next.' 68 212 560 30 20 $ORANGE $false 'Georgia' 1 $true | Out-Null
  Add-Text $slide "我不希望所谓的规划只是多做几个活动。`r`n如果有机会成为副部，我更希望把已经做得好的东西继续做好，同时让外联的一些工作变得更清楚、更容易接手，也更容易积累。" 69 302 610 85 17 (RGB 67 67 62) $false 'Microsoft YaHei' 1 | Out-Null
  Animate $slide $futureTitle $true 0
  Add-Footer $slide 19 "WHAT'S NEXT"

  $slideNum = 20
  foreach ($plan in $plans) { Add-PlanSlide $pres $plan $slideNum | Out-Null; $slideNum++ }

  # 24 — Responsibility bridge
  $slide = New-Slide $pres $ORANGE $false
  Add-Text $slide '04 / RESPONSIBILITY' 48 34 300 18 9 (RGB 133 52 22) $true 'Arial' 1 $false 2 | Out-Null
  Add-Text $slide 'Not a bigger title.' 70 130 820 74 47 (RGB 17 18 17) $true 'Arial' 1 | Out-Null
  Add-Text $slide 'A bigger responsibility.' 70 206 820 84 54 $WHITE $false 'Georgia' 1 $true | Out-Null
  Add-Text $slide "对我来说，竞选副部不是换一个 title。`r`n而是希望自己可以承担更多，也让下一次活动、下一次合作、下一届外联，比现在再往前一点。" 72 350 680 82 17 (RGB 73 39 25) $false 'Microsoft YaHei' 1 | Out-Null
  Add-Footer $slide 24 'RESPONSIBILITY'

  # 25 — Thank you
  $slide = New-Slide $pres $BG $false
  Add-Text $slide '05 / THANK YOU' 380 68 200 18 9 $MUTED $true 'Arial' 2 $false 2 | Out-Null
  $thanks = Add-Text $slide '谢谢大家。' 90 118 780 135 82 $WHITE $true 'Microsoft YaHei' 2
  Add-Text $slide 'Thanks for scrolling this far.' 155 258 650 45 30 $ORANGE $false 'Georgia' 2 $true | Out-Null
  Add-Text $slide 'And thanks for every moment along the way.' 155 319 650 20 10 $MUTED $true 'Arial' 2 $false 1.5 | Out-Null
  Add-Text $slide 'Eddy 盛世禾' 330 402 300 42 24 $WHITE $false 'Arial' 2 | Out-Null
  Add-Text $slide 'EXTERNAL RELATIONS · DEPUTY HEAD CANDIDATE' 275 449 410 18 8 $MUTED $true 'Arial' 2 $false 1.5 | Out-Null
  Animate $slide $thanks $true 0
  Add-Footer $slide 25 'THANK YOU'

  $pres.SaveAs($OutputPath, $PpSaveAsOpenXMLPresentation)
  $pres.Export($PreviewDir, 'PNG', 1600, 900)
} finally {
  if ($pres) { $pres.Close() }
  $ppt.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($pres) | Out-Null
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
}

