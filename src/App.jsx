import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.jsx'
import { ChevronDown, Download, Share, Settings, Moon, Sun, HelpCircle } from 'lucide-react'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  
  // 折りたたみ状態
  const [openSections, setOpenSections] = useState({
    basic: true,
    planning: true,
    models: true,
    animation: true,
    language: true,
    liveAction: true,
    rates: false
  })
  
  // 基本設定
  const [duration, setDuration] = useState(60)
  const [resolution, setResolution] = useState('1080p')
  const [additionalVersions, setAdditionalVersions] = useState(0)
  const [deliveryWeeks, setDeliveryWeeks] = useState(12)
  
  // 企画・構成
  const [planningLevel, setPlanningLevel] = useState('L0')
  const [workshops, setWorkshops] = useState(0)
  const [conceptVersions, setConceptVersions] = useState(1)
  const [research, setResearch] = useState('none')
  const [interviews, setInterviews] = useState(0)
  const [storyboardDetail, setStoryboardDetail] = useState('standard')
  const [brandGuide, setBrandGuide] = useState(false)
  const [approvalLayers, setApprovalLayers] = useState('single')
  
  // 3Dモデル
  const [scratchModels, setScratchModels] = useState({ S: 0, M: 0, L: 0 })
  const [cadModels, setCadModels] = useState({ small: 0, medium: 2, large: 0 })
  const [cadClean, setCadClean] = useState(true)
  
  // アニメーション
  const [animationComplexity, setAnimationComplexity] = useState('camera')
  const [motionGraphics, setMotionGraphics] = useState('none')
  const [lookDevelopment, setLookDevelopment] = useState('standard')
  
  // 言語・音声
  const [languages, setLanguages] = useState(['ja'])
  const [narrationTypes, setNarrationTypes] = useState({ ja: 'none' })
  const [subtitles, setSubtitles] = useState(0)
  const [scriptProvided, setScriptProvided] = useState('complete')
  
  // 実写撮影
  const [liveAction, setLiveAction] = useState(false)
  const [liveActionDays, setLiveActionDays] = useState(1)
  const [locationScouting, setLocationScouting] = useState(false)
  
  // 単価設定（編集可能）
  const [rates, setRates] = useState({
    pm: 9000,
    planner: 9000,
    writer: 7500,
    designer: 8000,
    cgGeneralist: 8500,
    modeler: 8000,
    animator: 8500,
    motionGraphics: 8500,
    compositor: 7500,
    sound: 7000,
    translationJaToEn: 18,
    translationEnToJa: 22,
    narratorAI: 500,
    narratorHuman: 50000,
    studio: 15000,
    bgmLicense: 20000
  })

  // 単価設定の表示名とヘルプテキスト
  const rateLabels = {
    pm: { name: 'プロジェクトマネージャー', unit: '円/時間', help: '企画・構成、実写撮影の管理業務に影響' },
    planner: { name: 'プランナー', unit: '円/時間', help: '企画・構成の企画レベル、ワークショップ、リサーチに影響' },
    writer: { name: 'ライター', unit: '円/時間', help: '言語関連の原稿作成、字幕作成に影響' },
    designer: { name: 'デザイナー', unit: '円/時間', help: '企画・構成の絵コンテ、ブランドガイド作成に影響' },
    cgGeneralist: { name: 'CGゼネラリスト', unit: '円/時間', help: 'アニメーションのルック開発、レンダリング、実写撮影に影響' },
    modeler: { name: 'モデラー', unit: '円/時間', help: 'モデリングのスクラッチモデル、CADモデル作成に影響' },
    animator: { name: 'アニメーター', unit: '円/時間', help: 'アニメーションの基本アニメーション作業に影響' },
    motionGraphics: { name: 'モーショングラフィックス', unit: '円/時間', help: 'アニメーションのモーショングラフィックス作業に影響' },
    compositor: { name: 'コンポジター', unit: '円/時間', help: '編集の映像編集、派生版本作成に影響' },
    sound: { name: 'サウンド', unit: '円/時間', help: '言語関連の音声編集作業に影響' },
    translationJaToEn: { name: '翻訳（日→英）', unit: '円/文字', help: '言語関連の日本語から英語への翻訳に影響' },
    translationEnToJa: { name: '翻訳（英→日）', unit: '円/単語', help: '言語関連の英語から日本語への翻訳に影響' },
    narratorAI: { name: 'AIナレーター', unit: '円/分', help: '言語関連のAI音声ナレーションに影響' },
    narratorHuman: { name: '人間ナレーター', unit: '円/30分', help: '言語関連の人間音声ナレーションに影響' },
    studio: { name: 'スタジオ', unit: '円/時間', help: '実写撮影のスタジオ使用料に影響' },
    bgmLicense: { name: 'BGMライセンス', unit: '円/曲', help: '言語関連のBGM使用料に影響' }
  }

  // ヘルプテキスト定義
  const helpTexts = {
    duration: '動画の長さ。長いほど制作工数が増加します。',
    resolution: '映像の解像度。4Kは1080pより約60%工数が増加します。',
    additionalVersions: '基本版以外の派生版本数。言語違いや尺違いなど。',
    deliveryWeeks: '制作期間。12週未満はラッシュ料金が適用されます。',
    planningLevel: 'L0:完全支給 < L1:絵コンテ作成 < L2:構成企画 < L3:ゼロベース企画',
    workshops: '要件定義・方向性すり合わせの共同作業回数（1回=約3時間）',
    conceptVersions: '初回1案。追加案は比較検討用の別軸提案（追加1案=11時間）',
    research: '市場調査や競合分析の深度。詳細ほど工数が増加します。',
    interviews: 'ステークホルダーへのヒアリング回数（1回=約2時間）',
    storyboardDetail: '絵コンテの詳細度。詳細ほどシーン数×工数が増加します。',
    brandGuide: 'ブランドガイドライン作成の有無（約16時間）',
    approvalLayers: '決裁の複雑さ。複雑ほど調整工数が増加します。',
    scratchModels: 'ゼロから作成する3Dモデル。小8h、中20h、大48h',
    cadModels: 'CADデータから変換する3Dモデル。小6h、中12h、大28h',
    cadClean: 'CADデータの整備状態。未整備の場合は追加工数が発生',
    animationComplexity: 'アニメーションの複雑度。複雑ほどショット数が増加',
    motionGraphics: 'テキストやグラフィックスの動的表現の量',
    lookDevelopment: 'マテリアルやライティングの開発工数',
    languages: '対応言語数。追加言語は翻訳・ナレーション工数が発生',
    narrationTypes: '各言語のナレーション種類。人間音声はAIより高額',
    subtitles: '字幕対応言語数。1言語あたり追加工数が発生',
    scriptProvided: '原稿の支給状況。未支給の場合は原稿作成工数が発生',
    liveAction: '実写撮影の有無。撮影日数に応じて工数が増加',
    liveActionDays: '実写撮影の日数。1日=8時間（PM1名、CG2名、スタジオ）',
    locationScouting: 'ロケーション下見の有無（PM1名、プランナー1名で6時間）'
  }

  // 言語選択の処理
  const handleLanguageChange = (lang, checked) => {
    if (checked) {
      setLanguages([...languages, lang])
      setNarrationTypes({...narrationTypes, [lang]: 'none'})
    } else {
      setLanguages(languages.filter(l => l !== lang))
      const newNarrationTypes = {...narrationTypes}
      delete newNarrationTypes[lang]
      setNarrationTypes(newNarrationTypes)
    }
  }

  // ナレーション種類の変更
  const handleNarrationChange = (lang, type) => {
    setNarrationTypes({...narrationTypes, [lang]: type})
  }

  // 単価変更の処理
  const handleRateChange = (key, value) => {
    setRates({...rates, [key]: parseFloat(value) || 0})
  }

  // 計算ロジック
  const estimate = useMemo(() => {
    const durationMinutes = duration / 60
    
    // シーン・ショット数の自動算出
    const scenes = Math.ceil(durationMinutes * 1.0)
    const shotsPerMinute = {
      camera: 4,
      exploded: 5,
      mechanical: 6,
      physics: 7
    }
    const shots = Math.ceil(durationMinutes * shotsPerMinute[animationComplexity])
    
    // 企画・構成費用
    let planningCost = 0
    const planningHours = {
      L0: 8,
      L1: 24,
      L2: 48,
      L3: 80
    }
    planningCost += planningHours[planningLevel] * rates.planner
    planningCost += workshops * 3 * rates.planner
    planningCost += (conceptVersions - 1) * 11 * rates.planner
    
    // リサーチ費用
    const researchHours = {
      none: 0,
      light: 8,
      detailed: 24
    }
    planningCost += researchHours[research] * rates.planner
    planningCost += interviews * 2 * rates.planner
    
    // 絵コンテ費用
    const storyboardHours = {
      rough: scenes * 0.5,
      standard: scenes * 1,
      detailed: scenes * 2
    }
    planningCost += storyboardHours[storyboardDetail] * rates.designer
    
    // ブランドガイド費用
    if (brandGuide) {
      planningCost += 16 * rates.designer
    }
    
    // 決裁段層による調整工数
    const approvalMultiplier = {
      single: 1.0,
      multi: 1.15,
      complex: 1.3
    }
    planningCost *= approvalMultiplier[approvalLayers]
    
    // モデリング費用
    let modelingCost = 0
    modelingCost += scratchModels.S * 8 * rates.modeler
    modelingCost += scratchModels.M * 20 * rates.modeler
    modelingCost += scratchModels.L * 48 * rates.modeler
    modelingCost += cadModels.small * 6 * rates.modeler
    modelingCost += cadModels.medium * 12 * rates.modeler
    modelingCost += cadModels.large * 28 * rates.modeler
    
    // CADクリーンナップ費用
    if (!cadClean) {
      const totalCadModels = cadModels.small + cadModels.medium + cadModels.large
      modelingCost += totalCadModels * 4 * rates.modeler
    }
    
    // アニメーション費用
    let animationCost = 0
    const animationHours = shots * 4 // 基本4時間/ショット
    animationCost += animationHours * rates.animator
    
    // モーショングラフィックス費用
    const motionGraphicsHours = {
      none: 0,
      light: durationMinutes * 2,
      medium: durationMinutes * 4,
      heavy: durationMinutes * 8
    }
    animationCost += motionGraphicsHours[motionGraphics] * rates.motionGraphics
    
    // ルック開発費用
    const lookDevHours = {
      light: 16,
      standard: 32,
      rich: 64
    }
    animationCost += lookDevHours[lookDevelopment] * rates.cgGeneralist
    
    // レンダリング費用
    let renderingCost = 0
    const resolutionMultiplier = resolution === '4K' ? 1.6 : 1.0
    renderingCost += shots * 2 * rates.cgGeneralist * resolutionMultiplier
    
    // 編集費用
    let editingCost = 0
    editingCost += durationMinutes * 2 * rates.compositor
    editingCost += additionalVersions * durationMinutes * 1 * rates.compositor
    
    // 言語関連費用
    let languageCost = 0
    
    // 原稿作成費用
    if (scriptProvided === 'none') {
      languageCost += durationMinutes * 100 * rates.writer / 400 // 400文字/分想定
    } else if (scriptProvided === 'partial') {
      languageCost += durationMinutes * 50 * rates.writer / 400
    }
    
    // ナレーション費用
    languages.forEach(lang => {
      if (narrationTypes[lang] === 'ai') {
        languageCost += durationMinutes * rates.narratorAI
      } else if (narrationTypes[lang] === 'human') {
        languageCost += rates.narratorHuman
      }
    })
    
    // 翻訳費用
    const baseLanguage = 'ja'
    languages.forEach(lang => {
      if (lang !== baseLanguage) {
        const wordCount = durationMinutes * 100 // 100文字/分想定
        if (lang === 'en') {
          languageCost += wordCount * rates.translationJaToEn
        } else {
          languageCost += wordCount * rates.translationJaToEn * 1.2 // 他言語は20%増し
        }
      }
    })
    
    // 字幕費用
    languageCost += subtitles * durationMinutes * 50 * rates.writer / 400
    
    // BGM費用
    languageCost += rates.bgmLicense
    
    // 実写撮影費用
    let liveActionCost = 0
    if (liveAction) {
      liveActionCost += liveActionDays * 8 * (rates.pm + rates.cgGeneralist * 2)
      if (locationScouting) {
        liveActionCost += 6 * (rates.pm + rates.planner)
      }
      // スタジオ費用
      liveActionCost += liveActionDays * 8 * rates.studio
    }
    
    // 小計
    const subtotal = planningCost + modelingCost + animationCost + renderingCost + editingCost + languageCost + liveActionCost
    
    // スケジュール調整
    const rushMultiplier = deliveryWeeks < 12 ? 1 + Math.min((12 - deliveryWeeks) * 0.1, 0.4) : 1
    const adjustedSubtotal = subtotal * rushMultiplier
    
    // 諸経費（利益を各費目に分散）
    const management = adjustedSubtotal * 0.08
    const profit = adjustedSubtotal * 0.18
    const contingency = adjustedSubtotal * 0.10
    
    // 利益を各費目に比例配分
    const totalBeforeProfit = adjustedSubtotal + management + contingency
    const profitDistribution = {
      planning: (planningCost * rushMultiplier / adjustedSubtotal) * profit,
      modeling: (modelingCost * rushMultiplier / adjustedSubtotal) * profit,
      animation: (animationCost * rushMultiplier / adjustedSubtotal) * profit,
      rendering: (renderingCost * rushMultiplier / adjustedSubtotal) * profit,
      editing: (editingCost * rushMultiplier / adjustedSubtotal) * profit,
      language: (languageCost * rushMultiplier / adjustedSubtotal) * profit,
      liveAction: (liveActionCost * rushMultiplier / adjustedSubtotal) * profit
    }
    
    const beforeTax = totalBeforeProfit + profit
    const tax = beforeTax * 0.10
    const total = beforeTax + tax
    
    return {
      subtotal: adjustedSubtotal,
      breakdown: {
        planning: planningCost * rushMultiplier + profitDistribution.planning,
        modeling: modelingCost * rushMultiplier + profitDistribution.modeling,
        animation: animationCost * rushMultiplier + profitDistribution.animation,
        rendering: renderingCost * rushMultiplier + profitDistribution.rendering,
        editing: editingCost * rushMultiplier + profitDistribution.editing,
        language: languageCost * rushMultiplier + profitDistribution.language,
        liveAction: liveActionCost * rushMultiplier + profitDistribution.liveAction
      },
      management,
      profit,
      contingency,
      beforeTax,
      tax,
      total,
      scenes,
      shots,
      rushMultiplier
    }
  }, [
    duration, resolution, additionalVersions, deliveryWeeks,
    planningLevel, workshops, conceptVersions, research, interviews,
    storyboardDetail, brandGuide, approvalLayers,
    scratchModels, cadModels, cadClean,
    animationComplexity, motionGraphics, lookDevelopment,
    languages, narrationTypes, subtitles, scriptProvided,
    liveAction, liveActionDays, locationScouting,
    rates
  ])

  // プリセット読み込み
  const loadBasicPreset = () => {
    setDuration(60)
    setResolution('1080p')
    setAdditionalVersions(0)
    setDeliveryWeeks(12)
    setLanguages(['ja'])
    setNarrationTypes({ ja: 'none' })
    setPlanningLevel('L0')
    setWorkshops(0)
    setConceptVersions(1)
    setCadModels({ small: 0, medium: 2, large: 0 })
    setCadClean(true)
    setAnimationComplexity('camera')
    setMotionGraphics('none')
    setLookDevelopment('standard')
    setLiveAction(false)
    setResearch('none')
    setInterviews(0)
    setStoryboardDetail('standard')
    setBrandGuide(false)
    setApprovalLayers('single')
    setSubtitles(0)
    setScriptProvided('complete')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${seconds}秒 (${minutes}分${remainingSeconds > 0 ? remainingSeconds + '秒' : ''})`
  }

  const formatDelivery = (weeks) => {
    const months = Math.floor(weeks / 4)
    const remainingWeeks = weeks % 4
    return `${weeks}週 (${months}ヶ月${remainingWeeks > 0 ? remainingWeeks + '週' : ''})`
  }

  const toggleSection = (section) => {
    setOpenSections(prev => ({...prev, [section]: !prev[section]}))
  }

  // ヘルプアイコンコンポーネント
  const HelpIcon = ({ text }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground">
        {/* ヘッダー */}
        <header className="border-b p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold">3DCG映像制作 概算見積りシミュレーター</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={loadBasicPreset}>
                Basicプリセット
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                PDF出力
              </Button>
              <Button variant="outline">
                <Share className="w-4 h-4 mr-2" />
                共有
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleSection('rates')}
              >
                <Settings className="w-4 h-4 mr-2" />
                単価設定
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* 単価設定パネル */}
        <Collapsible open={openSections.rates} onOpenChange={(open) => setOpenSections(prev => ({...prev, rates: open}))}>
          <CollapsibleContent>
            <div className="bg-muted/50 p-4 border-b">
              <div className="max-w-7xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">単価設定</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(rates).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">{rateLabels[key].name}</Label>
                        <HelpIcon text={rateLabels[key].help} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => handleRateChange(key, e.target.value)}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {rateLabels[key].unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* メインコンテンツ */}
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左列：入力フォーム */}
            <div className="space-y-6">
              {/* 基本設定 */}
              <Card>
                <Collapsible open={openSections.basic} onOpenChange={(open) => setOpenSections(prev => ({...prev, basic: open}))}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <CardTitle className="flex items-center justify-between">
                        基本設定
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSections.basic ? 'rotate-180' : ''}`} />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>動画尺: {formatDuration(duration)}</Label>
                          <HelpIcon text={helpTexts.duration} />
                        </div>
                        <Slider
                          value={[duration]}
                          onValueChange={(value) => setDuration(value[0])}
                          min={15}
                          max={600}
                          step={15}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>解像度</Label>
                          <HelpIcon text={helpTexts.resolution} />
                        </div>
                        <RadioGroup value={resolution} onValueChange={setResolution} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1080p" id="1080p" />
                            <Label htmlFor="1080p">1080p</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4K" id="4K" />
                            <Label htmlFor="4K">4K</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>派生版本数: {additionalVersions}本</Label>
                          <HelpIcon text={helpTexts.additionalVersions} />
                        </div>
                        <Slider
                          value={[additionalVersions]}
                          onValueChange={(value) => setAdditionalVersions(value[0])}
                          min={0}
                          max={10}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>納期: {formatDelivery(deliveryWeeks)}</Label>
                          <HelpIcon text={helpTexts.deliveryWeeks} />
                        </div>
                        <Slider
                          value={[deliveryWeeks]}
                          onValueChange={(value) => setDeliveryWeeks(value[0])}
                          min={4}
                          max={24}
                          step={1}
                          className="mt-2"
                        />
                        {deliveryWeeks < 12 && (
                          <p className="text-sm text-orange-600 mt-1">
                            ⚠️ ラッシュ料金 +{Math.round((12 - deliveryWeeks) * 10)}%
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 企画・構成 */}
              <Card>
                <Collapsible open={openSections.planning} onOpenChange={(open) => setOpenSections(prev => ({...prev, planning: open}))}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <CardTitle className="flex items-center justify-between">
                        企画・構成
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSections.planning ? 'rotate-180' : ''}`} />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>企画レベル</Label>
                          <HelpIcon text={helpTexts.planningLevel} />
                        </div>
                        <RadioGroup value={planningLevel} onValueChange={setPlanningLevel} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="L0" id="L0" />
                            <Label htmlFor="L0">L0: 完全支給</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="L1" id="L1" />
                            <Label htmlFor="L1">L1: 流れ支給＋絵コンテ</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="L2" id="L2" />
                            <Label htmlFor="L2">L2: 構成企画から制作側</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="L3" id="L3" />
                            <Label htmlFor="L3">L3: ゼロベース企画</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>ワークショップ回数: {workshops}回</Label>
                          <HelpIcon text={helpTexts.workshops} />
                        </div>
                        <Slider
                          value={[workshops]}
                          onValueChange={(value) => setWorkshops(value[0])}
                          min={0}
                          max={6}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>コンセプト案数: {conceptVersions}案</Label>
                          <HelpIcon text={helpTexts.conceptVersions} />
                        </div>
                        <Slider
                          value={[conceptVersions]}
                          onValueChange={(value) => setConceptVersions(value[0])}
                          min={1}
                          max={5}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>リサーチ</Label>
                          <HelpIcon text={helpTexts.research} />
                        </div>
                        <RadioGroup value={research} onValueChange={setResearch} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="research-none" />
                            <Label htmlFor="research-none">なし</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="research-light" />
                            <Label htmlFor="research-light">軽度</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="detailed" id="research-detailed" />
                            <Label htmlFor="research-detailed">詳細</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>インタビュー数: {interviews}件</Label>
                          <HelpIcon text={helpTexts.interviews} />
                        </div>
                        <Slider
                          value={[interviews]}
                          onValueChange={(value) => setInterviews(value[0])}
                          min={0}
                          max={10}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>絵コンテ粒度</Label>
                          <HelpIcon text={helpTexts.storyboardDetail} />
                        </div>
                        <RadioGroup value={storyboardDetail} onValueChange={setStoryboardDetail} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rough" id="storyboard-rough" />
                            <Label htmlFor="storyboard-rough">ラフ</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="storyboard-standard" />
                            <Label htmlFor="storyboard-standard">標準</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="detailed" id="storyboard-detailed" />
                            <Label htmlFor="storyboard-detailed">詳細</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="brandGuide"
                          checked={brandGuide}
                          onCheckedChange={setBrandGuide}
                        />
                        <Label htmlFor="brandGuide">ブランドガイド有無</Label>
                        <HelpIcon text={helpTexts.brandGuide} />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>決裁段層</Label>
                          <HelpIcon text={helpTexts.approvalLayers} />
                        </div>
                        <RadioGroup value={approvalLayers} onValueChange={setApprovalLayers} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="single" id="approval-single" />
                            <Label htmlFor="approval-single">単層</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="multi" id="approval-multi" />
                            <Label htmlFor="approval-multi">複層</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="complex" id="approval-complex" />
                            <Label htmlFor="approval-complex">複雑</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 3Dモデル */}
              <Card>
                <Collapsible open={openSections.models} onOpenChange={(open) => setOpenSections(prev => ({...prev, models: open}))}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <CardTitle className="flex items-center justify-between">
                        3Dモデル
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSections.models ? 'rotate-180' : ''}`} />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label className="text-sm font-medium">スクラッチモデル数</Label>
                          <HelpIcon text={helpTexts.scratchModels} />
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div>
                            <Label className="text-xs">小(8h): {scratchModels.S}</Label>
                            <Slider
                              value={[scratchModels.S]}
                              onValueChange={(value) => setScratchModels({...scratchModels, S: value[0]})}
                              min={0}
                              max={10}
                              step={1}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">中(20h): {scratchModels.M}</Label>
                            <Slider
                              value={[scratchModels.M]}
                              onValueChange={(value) => setScratchModels({...scratchModels, M: value[0]})}
                              min={0}
                              max={10}
                              step={1}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">大(48h): {scratchModels.L}</Label>
                            <Slider
                              value={[scratchModels.L]}
                              onValueChange={(value) => setScratchModels({...scratchModels, L: value[0]})}
                              min={0}
                              max={10}
                              step={1}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label className="text-sm font-medium">CADモデル数</Label>
                          <HelpIcon text={helpTexts.cadModels} />
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <div>
                            <Label className="text-xs">小(6h): {cadModels.small}</Label>
                            <Slider
                              value={[cadModels.small]}
                              onValueChange={(value) => setCadModels({...cadModels, small: value[0]})}
                              min={0}
                              max={10}
                              step={1}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">中(12h): {cadModels.medium}</Label>
                            <Slider
                              value={[cadModels.medium]}
                              onValueChange={(value) => setCadModels({...cadModels, medium: value[0]})}
                              min={0}
                              max={10}
                              step={1}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">大(28h): {cadModels.large}</Label>
                            <Slider
                              value={[cadModels.large]}
                              onValueChange={(value) => setCadModels({...cadModels, large: value[0]})}
                              min={0}
                              max={10}
                              step={1}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cadClean"
                          checked={cadClean}
                          onCheckedChange={setCadClean}
                        />
                        <Label htmlFor="cadClean">CADクリーン状態</Label>
                        <HelpIcon text={helpTexts.cadClean} />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* アニメーション */}
              <Card>
                <Collapsible open={openSections.animation} onOpenChange={(open) => setOpenSections(prev => ({...prev, animation: open}))}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <CardTitle className="flex items-center justify-between">
                        アニメーション
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSections.animation ? 'rotate-180' : ''}`} />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>複雑度</Label>
                          <HelpIcon text={helpTexts.animationComplexity} />
                        </div>
                        <RadioGroup value={animationComplexity} onValueChange={setAnimationComplexity} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="camera" id="camera" />
                            <Label htmlFor="camera">カメラワーク</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="exploded" id="exploded" />
                            <Label htmlFor="exploded">分解表現</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mechanical" id="mechanical" />
                            <Label htmlFor="mechanical">機械動作</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="physics" id="physics" />
                            <Label htmlFor="physics">物理シミュレーション</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>モーショングラフィックス</Label>
                          <HelpIcon text={helpTexts.motionGraphics} />
                        </div>
                        <RadioGroup value={motionGraphics} onValueChange={setMotionGraphics} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="motion-none" />
                            <Label htmlFor="motion-none">なし</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="motion-light" />
                            <Label htmlFor="motion-light">軽度</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="motion-medium" />
                            <Label htmlFor="motion-medium">中程度</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="heavy" id="motion-heavy" />
                            <Label htmlFor="motion-heavy">重度</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>ルック開発</Label>
                          <HelpIcon text={helpTexts.lookDevelopment} />
                        </div>
                        <RadioGroup value={lookDevelopment} onValueChange={setLookDevelopment} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="look-light" />
                            <Label htmlFor="look-light">軽度</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="look-standard" />
                            <Label htmlFor="look-standard">標準</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rich" id="look-rich" />
                            <Label htmlFor="look-rich">リッチ</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 言語・音声 */}
              <Card>
                <Collapsible open={openSections.language} onOpenChange={(open) => setOpenSections(prev => ({...prev, language: open}))}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <CardTitle className="flex items-center justify-between">
                        言語・音声
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSections.language ? 'rotate-180' : ''}`} />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>対応言語</Label>
                          <HelpIcon text={helpTexts.languages} />
                        </div>
                        <div className="mt-2 space-y-2">
                          {[
                            { code: 'ja', name: '日本語' },
                            { code: 'en', name: '英語' },
                            { code: 'zh', name: '中国語' },
                            { code: 'ko', name: '韓国語' }
                          ].map(lang => (
                            <div key={lang.code} className="flex items-center space-x-2">
                              <Checkbox
                                id={`lang-${lang.code}`}
                                checked={languages.includes(lang.code)}
                                onCheckedChange={(checked) => handleLanguageChange(lang.code, checked)}
                              />
                              <Label htmlFor={`lang-${lang.code}`}>{lang.name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>ナレーション種類</Label>
                          <HelpIcon text={helpTexts.narrationTypes} />
                        </div>
                        <div className="mt-2 space-y-3">
                          {languages.map(lang => (
                            <div key={lang} className="space-y-2">
                              <Label className="text-sm font-medium">
                                {lang === 'ja' ? '日本語' : lang === 'en' ? '英語' : lang === 'zh' ? '中国語' : '韓国語'}
                              </Label>
                              <RadioGroup 
                                value={narrationTypes[lang] || 'none'} 
                                onValueChange={(value) => handleNarrationChange(lang, value)}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="none" id={`narration-${lang}-none`} />
                                  <Label htmlFor={`narration-${lang}-none`}>なし</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="ai" id={`narration-${lang}-ai`} />
                                  <Label htmlFor={`narration-${lang}-ai`}>AI音声</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="human" id={`narration-${lang}-human`} />
                                  <Label htmlFor={`narration-${lang}-human`}>人間音声</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>字幕言語数: {subtitles}言語</Label>
                          <HelpIcon text={helpTexts.subtitles} />
                        </div>
                        <Slider
                          value={[subtitles]}
                          onValueChange={(value) => setSubtitles(value[0])}
                          min={0}
                          max={10}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Label>原稿支給</Label>
                          <HelpIcon text={helpTexts.scriptProvided} />
                        </div>
                        <RadioGroup value={scriptProvided} onValueChange={setScriptProvided} className="mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="complete" id="script-complete" />
                            <Label htmlFor="script-complete">完全支給</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="partial" id="script-partial" />
                            <Label htmlFor="script-partial">部分支給</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="none" id="script-none" />
                            <Label htmlFor="script-none">なし</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* 実写撮影 */}
              <Card>
                <Collapsible open={openSections.liveAction} onOpenChange={(open) => setOpenSections(prev => ({...prev, liveAction: open}))}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50">
                      <CardTitle className="flex items-center justify-between">
                        実写撮影
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSections.liveAction ? 'rotate-180' : ''}`} />
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="liveAction"
                          checked={liveAction}
                          onCheckedChange={setLiveAction}
                        />
                        <Label htmlFor="liveAction">実写撮影有無</Label>
                        <HelpIcon text={helpTexts.liveAction} />
                      </div>
                      
                      {liveAction && (
                        <>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Label>撮影日数: {liveActionDays}日</Label>
                              <HelpIcon text={helpTexts.liveActionDays} />
                            </div>
                            <Slider
                              value={[liveActionDays]}
                              onValueChange={(value) => setLiveActionDays(value[0])}
                              min={1}
                              max={10}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="locationScouting"
                              checked={locationScouting}
                              onCheckedChange={setLocationScouting}
                            />
                            <Label htmlFor="locationScouting">ロケハン有無</Label>
                            <HelpIcon text={helpTexts.locationScouting} />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </div>

            {/* 中央列：見積結果 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>見積結果</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(estimate.total)}
                    </div>
                    <div className="text-sm text-muted-foreground">税込総額</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl">
                      {formatCurrency(estimate.beforeTax)}
                    </div>
                    <div className="text-sm text-muted-foreground">税抜合計</div>
                  </div>
                  
                  {estimate.rushMultiplier > 1 && (
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-orange-800">
                        ラッシュ料金適用: +{Math.round((estimate.rushMultiplier - 1) * 100)}%
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>費目別内訳</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>企画・構成</span>
                    <span>{formatCurrency(estimate.breakdown.planning)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>モデリング</span>
                    <span>{formatCurrency(estimate.breakdown.modeling)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>アニメーション</span>
                    <span>{formatCurrency(estimate.breakdown.animation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>レンダリング</span>
                    <span>{formatCurrency(estimate.breakdown.rendering)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>編集</span>
                    <span>{formatCurrency(estimate.breakdown.editing)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>言語関連</span>
                    <span>{formatCurrency(estimate.breakdown.language)}</span>
                  </div>
                  {liveAction && (
                    <div className="flex justify-between">
                      <span>実写撮影</span>
                      <span>{formatCurrency(estimate.breakdown.liveAction)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between">
                    <span>小計</span>
                    <span>{formatCurrency(estimate.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>管理費 (8%)</span>
                    <span>{formatCurrency(estimate.management)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>予備費 (10%)</span>
                    <span>{formatCurrency(estimate.contingency)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>消費税 (10%)</span>
                    <span>{formatCurrency(estimate.tax)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>想定スケジュール</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatDelivery(deliveryWeeks)}</div>
                    <div className="text-sm text-muted-foreground">
                      シーン数: {estimate.scenes} / ショット数: {estimate.shots}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右列：計算根拠 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>計算根拠</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="details">詳細</TabsTrigger>
                      <TabsTrigger value="assumptions">前提条件</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4">
                      <div className="text-sm space-y-2">
                        <div>
                          <strong>基本情報</strong>
                          <ul className="ml-4 space-y-1">
                            <li>動画尺: {formatDuration(duration)}</li>
                            <li>解像度: {resolution}</li>
                            <li>納期: {formatDelivery(deliveryWeeks)}</li>
                            <li>シーン数: {estimate.scenes}</li>
                            <li>ショット数: {estimate.shots}</li>
                          </ul>
                        </div>
                        
                        <div>
                          <strong>工数内訳</strong>
                          <ul className="ml-4 space-y-1">
                            <li>企画レベル: {planningLevel}</li>
                            <li>ワークショップ: {workshops}回</li>
                            <li>コンセプト案: {conceptVersions}案</li>
                            <li>決裁段層: {approvalLayers}</li>
                            <li>CADモデル: 小{cadModels.small}・中{cadModels.medium}・大{cadModels.large}</li>
                            <li>アニメーション: {animationComplexity}</li>
                            <li>対応言語: {languages.join(', ')}</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="assumptions" className="space-y-4">
                      <div className="text-sm space-y-2">
                        <div>
                          <strong>前提条件</strong>
                          <ul className="ml-4 space-y-1">
                            <li>支給3DCADは変換・整備を前提とした工数です</li>
                            <li>リテイクは2回分を含みます</li>
                            <li>BGMはライセンス料1曲分を含みます</li>
                            <li>利益は各費目に比例配分されています</li>
                          </ul>
                        </div>
                        
                        <div>
                          <strong>除外事項</strong>
                          <ul className="ml-4 space-y-1">
                            <li>重度のCADクリーンナップは追加費用</li>
                            <li>絵コンテ後の大幅な構成変更</li>
                            <li>3回目以降の大幅リテイク</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

