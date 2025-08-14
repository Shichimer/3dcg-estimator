import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.jsx'
import { ChevronDown, Download, Share, Settings, Moon, Sun, HelpCircle } from 'lucide-react'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  
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
  
  // 単価設定
  const [rates] = useState({
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
    
    // モデリング費用
    let modelingCost = 0
    modelingCost += scratchModels.S * 8 * rates.modeler
    modelingCost += scratchModels.M * 20 * rates.modeler
    modelingCost += scratchModels.L * 48 * rates.modeler
    modelingCost += cadModels.small * 6 * rates.modeler
    modelingCost += cadModels.medium * 12 * rates.modeler
    modelingCost += cadModels.large * 28 * rates.modeler
    
    // アニメーション費用
    let animationCost = 0
    const animationHours = shots * 4 // 基本4時間/ショット
    animationCost += animationHours * rates.animator
    
    // レンダリング費用
    let renderingCost = 0
    const resolutionMultiplier = resolution === '4K' ? 1.6 : 1.0
    renderingCost += shots * 2 * rates.cgGeneralist * resolutionMultiplier
    
    // 編集費用
    let editingCost = 0
    editingCost += durationMinutes * 2 * rates.compositor
    
    // 言語関連費用
    let languageCost = 0
    languages.forEach(lang => {
      if (narrationTypes[lang] === 'ai') {
        languageCost += durationMinutes * rates.narratorAI
      } else if (narrationTypes[lang] === 'human') {
        languageCost += rates.narratorHuman
      }
    })
    
    // 実写撮影費用
    let liveActionCost = 0
    if (liveAction) {
      liveActionCost += liveActionDays * 8 * (rates.pm + rates.cgGeneralist * 2)
      if (locationScouting) {
        liveActionCost += 6 * (rates.pm + rates.planner)
      }
    }
    
    // 小計
    const subtotal = planningCost + modelingCost + animationCost + renderingCost + editingCost + languageCost + liveActionCost
    
    // スケジュール調整
    const rushMultiplier = deliveryWeeks < 12 ? 1 + Math.min((12 - deliveryWeeks) * 0.1, 0.4) : 1
    const adjustedSubtotal = subtotal * rushMultiplier
    
    // 諸経費
    const management = adjustedSubtotal * 0.08
    const profit = adjustedSubtotal * 0.18
    const contingency = adjustedSubtotal * 0.10
    const beforeTax = adjustedSubtotal + management + profit + contingency
    const tax = beforeTax * 0.10
    const total = beforeTax + tax
    
    return {
      subtotal: adjustedSubtotal,
      breakdown: {
        planning: planningCost * rushMultiplier,
        modeling: modelingCost * rushMultiplier,
        animation: animationCost * rushMultiplier,
        rendering: renderingCost * rushMultiplier,
        editing: editingCost * rushMultiplier,
        language: languageCost * rushMultiplier,
        liveAction: liveActionCost * rushMultiplier
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
    setLiveAction(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount)
  }

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
              <Button variant="outline">
                <Settings className="w-4 h-4" />
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

        {/* メインコンテンツ */}
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左列：入力フォーム */}
            <div className="space-y-6">
              {/* 基本設定 */}
              <Card>
                <CardHeader>
                  <CardTitle>基本設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>動画尺: {duration}秒</Label>
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
                    <Label>解像度</Label>
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
                    <Label>派生版本数: {additionalVersions}本</Label>
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
                    <Label>納期: {deliveryWeeks}週</Label>
                    <Slider
                      value={[deliveryWeeks]}
                      onValueChange={(value) => setDeliveryWeeks(value[0])}
                      min={4}
                      max={20}
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
              </Card>

              {/* 企画・構成 */}
              <Card>
                <CardHeader>
                  <CardTitle>企画・構成</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>企画レベル</Label>
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
                    <div className="flex items-center gap-2">
                      <Label>ワークショップ回数: {workshops}回</Label>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" title="要件定義・方向性すり合わせの共同作業回数（1回=約3h）" />
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
                    <div className="flex items-center gap-2">
                      <Label>コンセプト案数: {conceptVersions}案</Label>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" title="初回1案。追加案は比較検討用の別軸提案（追加1案=11h）" />
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
                </CardContent>
              </Card>

              {/* 3Dモデル */}
              <Card>
                <CardHeader>
                  <CardTitle>3Dモデル</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">CADモデル数</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <Label className="text-xs">小: {cadModels.small}</Label>
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
                        <Label className="text-xs">中: {cadModels.medium}</Label>
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
                        <Label className="text-xs">大: {cadModels.large}</Label>
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
                  </div>
                </CardContent>
              </Card>

              {/* アニメーション */}
              <Card>
                <CardHeader>
                  <CardTitle>アニメーション</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>複雑度</Label>
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
                </CardContent>
              </Card>

              {/* 実写撮影 */}
              <Card>
                <CardHeader>
                  <CardTitle>実写撮影</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="liveAction"
                      checked={liveAction}
                      onCheckedChange={setLiveAction}
                    />
                    <Label htmlFor="liveAction">実写撮影有無</Label>
                  </div>
                  
                  {liveAction && (
                    <>
                      <div>
                        <Label>撮影日数: {liveActionDays}日</Label>
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
                      </div>
                    </>
                  )}
                </CardContent>
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
                    <span>利益 (18%)</span>
                    <span>{formatCurrency(estimate.profit)}</span>
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
                    <div className="text-2xl font-bold">{deliveryWeeks}週</div>
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
                            <li>動画尺: {duration}秒 ({(duration/60).toFixed(1)}分)</li>
                            <li>解像度: {resolution}</li>
                            <li>納期: {deliveryWeeks}週</li>
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
                            <li>CADモデル: 小{cadModels.small}・中{cadModels.medium}・大{cadModels.large}</li>
                            <li>アニメーション: {animationComplexity}</li>
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

