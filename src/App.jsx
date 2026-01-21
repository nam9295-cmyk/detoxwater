import { useState, useMemo } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts'

// 재료별 건강 효능 및 맛 데이터
const INGREDIENTS = {
    doraji: {
        name: '도라지',
        stats: { respiratory: 10, immunity: 8, digestion: 5, energy: 3, relaxation: 4 },
        flavor: { sweet: 2, bitter: 8, nutty: 5, body: 4, aroma: 3 }
    },
    cacao: {
        name: '카카오',
        stats: { respiratory: 2, immunity: 6, digestion: 4, energy: 5, relaxation: 9 },
        flavor: { sweet: 3, bitter: 5, nutty: 10, body: 9, aroma: 6 }
    },
    tea: {
        name: '홍차',
        stats: { respiratory: 3, immunity: 5, digestion: 7, energy: 9, relaxation: 5 },
        flavor: { sweet: 1, bitter: 6, nutty: 4, body: 6, aroma: 8 }
    }
}

// 건강 효능 라벨
const STAT_LABELS = {
    respiratory: '호흡기',
    immunity: '면역력',
    digestion: '소화',
    energy: '에너지',
    relaxation: '릴렉스'
}

// 맛 프로필 라벨
const FLAVOR_LABELS = {
    sweet: '단맛',
    bitter: '쓴맛',
    nutty: '고소함',
    body: '바디감',
    aroma: '향'
}

// 슬라이더 컴포넌트 - App 외부에 정의해서 리렌더링 시 재생성 방지
function Slider({ label, value, onChange, color, emoji, colorClass }) {
    const handleInput = (e) => {
        onChange(Number(e.target.value))
    }

    return (
        <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <span className="text-white/80 text-sm w-12 flex-shrink-0">{label}</span>
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onInput={handleInput}
                onChange={handleInput}
                className={`flex-1 h-5 ${colorClass}`}
                style={{ cursor: 'pointer' }}
            />
            <span
                className="px-2 py-0.5 rounded-full text-xs font-bold w-12 text-center flex-shrink-0"
                style={{
                    backgroundColor: `${color}33`,
                    color: color
                }}
            >
                {value}%
            </span>
        </div>
    )
}

function App() {
    // 슬라이더 상태값 (0-100)
    const [doraji, setDoraji] = useState(30)  // 도라지 - Beige/Gold 색상
    const [cacao, setCacao] = useState(20)    // 카카오 - Brown 색상
    const [tea, setTea] = useState(50)        // 홍차 - Red 색상

    // 동적 색상 계산
    const liquidColor = useMemo(() => {
        // 기본 색상 정의 (RGB)
        const colors = {
            base: { r: 255, g: 250, b: 240 },     // 기본 맑은 색 (약간 따뜻한 화이트)
            doraji: { r: 232, g: 212, b: 168 },   // 도라지 - Beige/Gold
            cacao: { r: 101, g: 67, b: 33 },      // 카카오 - Brown
            tea: { r: 180, g: 60, b: 50 }         // 홍차 - Red/Amber
        }

        // 각 재료의 영향력 계산 (정규화)
        const total = doraji + cacao + tea
        if (total === 0) {
            return 'rgba(255, 250, 240, 0.3)' // 아무것도 없으면 투명한 기본색
        }

        const weights = {
            doraji: doraji / 100,
            cacao: cacao / 100,
            tea: tea / 100
        }

        // 색상 혼합 계산
        const r = Math.round(
            colors.base.r * 0.1 +
            colors.doraji.r * weights.doraji * 0.3 +
            colors.cacao.r * weights.cacao * 0.4 +
            colors.tea.r * weights.tea * 0.4
        )
        const g = Math.round(
            colors.base.g * 0.1 +
            colors.doraji.g * weights.doraji * 0.3 +
            colors.cacao.g * weights.cacao * 0.4 +
            colors.tea.g * weights.tea * 0.4
        )
        const b = Math.round(
            colors.base.b * 0.1 +
            colors.doraji.b * weights.doraji * 0.3 +
            colors.cacao.b * weights.cacao * 0.4 +
            colors.tea.b * weights.tea * 0.4
        )

        // 투명도는 총 재료량에 따라 결정 (0.3 ~ 0.85)
        const opacity = 0.3 + (total / 300) * 0.55

        return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }, [doraji, cacao, tea])

    // 건강 밸런스 차트 데이터 계산
    const healthData = useMemo(() => {
        const total = doraji + cacao + tea

        // 총 투입량이 0이면 기본값 반환
        if (total === 0) {
            return Object.keys(STAT_LABELS).map(key => ({
                stat: STAT_LABELS[key],
                value: 0,
                fullMark: 10
            }))
        }

        // 가중 평균 계산
        return Object.keys(STAT_LABELS).map(key => {
            const weightedSum =
                INGREDIENTS.doraji.stats[key] * doraji +
                INGREDIENTS.cacao.stats[key] * cacao +
                INGREDIENTS.tea.stats[key] * tea

            const average = weightedSum / total

            return {
                stat: STAT_LABELS[key],
                value: Math.round(average * 10) / 10,
                fullMark: 10
            }
        })
    }, [doraji, cacao, tea])

    // 맛 프로필 차트 데이터 계산
    const flavorData = useMemo(() => {
        const total = doraji + cacao + tea

        if (total === 0) {
            return Object.keys(FLAVOR_LABELS).map(key => ({
                name: FLAVOR_LABELS[key],
                value: 0
            }))
        }

        return Object.keys(FLAVOR_LABELS).map(key => {
            const weightedSum =
                INGREDIENTS.doraji.flavor[key] * doraji +
                INGREDIENTS.cacao.flavor[key] * cacao +
                INGREDIENTS.tea.flavor[key] * tea

            const average = weightedSum / total

            return {
                name: FLAVOR_LABELS[key],
                value: Math.round(average * 10) / 10
            }
        })
    }, [doraji, cacao, tea])

    // 맛 프로필 바 색상
    const FLAVOR_COLORS = ['#F472B6', '#FB923C', '#A78BFA', '#38BDF8', '#4ADE80']

    return (
        <div className="min-h-screen flex flex-col items-center justify-start py-6 px-4 md:py-8 md:px-8 overflow-x-hidden">
            {/* 헤더 */}
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
                🍵 티 블렌딩 시뮬레이션
            </h1>
            <p className="text-white/60 mb-6 md:mb-8 text-center text-sm md:text-base px-2">
                슬라이더를 조절하여 나만의 특별한 블렌드를 만들어보세요
            </p>

            {/* 메인 콘텐츠: 티팟 + 차트들 */}
            <div className="flex flex-row items-center justify-center gap-4 md:gap-8 w-full max-w-4xl mb-6">
                {/* 왼쪽: 티팟 */}
                <div className="relative flex-shrink-0">
                    {/* 글로우 효과 */}
                    <div
                        className="absolute inset-0 blur-3xl opacity-40 rounded-full"
                        style={{
                            backgroundColor: liquidColor,
                            transform: 'scale(0.6)',
                        }}
                    />
                    {/* 티팟 */}
                    <div className="teapot-container-small float-animation glow-effect">
                        <div
                            className="liquid-layer-small"
                            style={{ backgroundColor: liquidColor }}
                        />
                        <div className="teapot-overlay-small" />
                    </div>
                </div>

                {/* 오른쪽: 차트들 (상하 배치) */}
                <div className="flex flex-col gap-3">
                    {/* 건강 밸런스 차트 */}
                    <div className="glass-card p-2 md:p-3">
                        <h3 className="text-white/80 text-xs font-medium mb-1 text-center">💪 건강 밸런스</h3>
                        <div className="w-28 h-28 md:w-36 md:h-36">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="75%"
                                    data={healthData}
                                >
                                    <PolarGrid
                                        stroke="rgba(255, 255, 255, 0.2)"
                                        strokeWidth={1}
                                    />
                                    <PolarAngleAxis
                                        dataKey="stat"
                                        tick={{
                                            fill: 'rgba(255, 255, 255, 0.8)',
                                            fontSize: 8,
                                            fontWeight: 500
                                        }}
                                        tickLine={false}
                                    />
                                    <PolarRadiusAxis
                                        angle={90}
                                        domain={[0, 10]}
                                        tick={false}
                                        axisLine={false}
                                    />
                                    <Radar
                                        name="건강 지수"
                                        dataKey="value"
                                        stroke="#F59E0B"
                                        strokeWidth={2}
                                        fill="url(#goldGradient)"
                                        fillOpacity={0.5}
                                        isAnimationActive={true}
                                        animationDuration={200}
                                        animationEasing="linear"
                                    />
                                    <defs>
                                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#D97706" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 맛 프로필 차트 */}
                    <div className="glass-card p-2 md:p-3">
                        <h3 className="text-white/80 text-xs font-medium mb-1 text-center">📊 맛 프로필</h3>
                        <div className="w-28 h-28 md:w-36 md:h-36">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={flavorData}
                                    layout="vertical"
                                    margin={{ top: 0, right: 5, bottom: 0, left: 0 }}
                                >
                                    <XAxis type="number" domain={[0, 10]} hide />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        width={32}
                                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 8 }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Bar
                                        dataKey="value"
                                        radius={[0, 4, 4, 0]}
                                        isAnimationActive={true}
                                        animationDuration={200}
                                    >
                                        {flavorData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={FLAVOR_COLORS[index]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단: 슬라이더 컨트롤 */}
            <div className="glass-card p-3 md:p-4 w-full max-w-md">
                <div className="flex items-center gap-2 mb-3">
                    <span>🎨</span>
                    <span className="text-sm font-semibold text-white">재료 조절</span>
                    <div
                        className="ml-auto w-6 h-6 rounded-full shadow-lg border-2 border-white/20"
                        style={{ backgroundColor: liquidColor }}
                    />
                </div>

                <div className="space-y-2">
                    <Slider
                        label="도라지"
                        value={doraji}
                        onChange={setDoraji}
                        color="#E8D4A8"
                        emoji="🌾"
                        colorClass="slider-doraji"
                    />
                    <Slider
                        label="카카오"
                        value={cacao}
                        onChange={setCacao}
                        color="#8B4513"
                        emoji="🫘"
                        colorClass="slider-cacao"
                    />
                    <Slider
                        label="홍차"
                        value={tea}
                        onChange={setTea}
                        color="#B8423F"
                        emoji="🍂"
                        colorClass="slider-tea"
                    />
                </div>
            </div>

            {/* 푸터 */}
            <p className="mt-12 text-white/30 text-sm">
                🍃 Detox Tea Blending Studio
            </p>
        </div>
    )
}

export default App
