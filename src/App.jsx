import { useState, useMemo } from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts'

// 4종 티 제품 데이터
const TEA_PRODUCTS = {
    british: {
        id: 'british',
        name: '브리티쉬 블랙',
        desc: '도라지와 홍차의 깊은 풍미',
        baseColor: '#8B0000',
        available: true,
        ingredients: {
            doraji: {
                name: '도라지',
                emoji: '🌾',
                stats: { respiratory: 10, immunity: 8, digestion: 5, energy: 3, relaxation: 4 },
                flavor: { sweet: 2, bitter: 8, nutty: 5, body: 4, aroma: 3 },
                color: '#E8D4A8'
            },
            cacao: {
                name: '카카오',
                emoji: '🫘',
                stats: { respiratory: 2, immunity: 6, digestion: 4, energy: 5, relaxation: 9 },
                flavor: { sweet: 3, bitter: 5, nutty: 10, body: 9, aroma: 6 },
                color: '#8B4513'
            },
            tea: {
                name: '홍차',
                emoji: '🍂',
                stats: { respiratory: 3, immunity: 5, digestion: 7, energy: 9, relaxation: 5 },
                flavor: { sweet: 1, bitter: 6, nutty: 4, body: 6, aroma: 8 },
                color: '#B8423F'
            }
        }
    },
    asian: {
        id: 'asian',
        name: '아시안 골드',
        desc: '우롱과 유자의 산뜻한 만남',
        baseColor: '#D4AF37',
        available: true,
        ingredients: {
            cacao: {
                name: '카카오',
                emoji: '🫘',
                stats: { respiratory: 2, immunity: 6, digestion: 4, energy: 5, relaxation: 9 },
                flavor: { sweet: 1, bitter: 5, nutty: 10, body: 9, aroma: 6 },
                color: '#5D4037'
            },
            oolong: {
                name: '우롱차',
                emoji: '🍃',
                stats: { respiratory: 4, immunity: 5, digestion: 10, energy: 6, relaxation: 7 },
                flavor: { sweet: 2, bitter: 4, nutty: 6, body: 5, aroma: 9 },
                color: '#CC9900'
            },
            yuja: {
                name: '유자',
                emoji: '🍋',
                stats: { respiratory: 8, immunity: 10, digestion: 7, energy: 8, relaxation: 6 },
                flavor: { sweet: 1, bitter: 3, nutty: 0, body: 2, aroma: 10 },
                color: '#FFD700'
            }
        }
    },
    hibiscus: {
        id: 'hibiscus',
        name: '히비스커스 프룻',
        desc: '오미자와 히비스커스의 완벽한 클렌즈',
        baseColor: '#E0115F',
        available: true,
        ingredients: {
            cacao: {
                name: '카카오',
                emoji: '🫘',
                stats: { respiratory: 2, immunity: 6, digestion: 4, energy: 5, relaxation: 9 },
                flavor: { sweet: 2, bitter: 5, nutty: 10, body: 9, aroma: 6 },
                color: '#5D4037'
            },
            hibiscus: {
                name: '히비스커스 꽃잎',
                emoji: '🌺',
                stats: { respiratory: 3, immunity: 7, digestion: 10, energy: 6, relaxation: 5 },
                flavor: { sweet: 1, bitter: 1, nutty: 0, body: 2, aroma: 9 },
                color: '#FF1493'
            },
            omija: {
                name: '문경 오미자',
                emoji: '🫐',
                stats: { respiratory: 8, immunity: 9, digestion: 9, energy: 7, relaxation: 4 },
                flavor: { sweet: 5, bitter: 4, nutty: 0, body: 4, aroma: 7 },
                color: '#DC143C'
            }
        }
    },
    minty: {
        id: 'minty',
        name: '민티 쇼콜라',
        desc: '제주 녹차와 민트의 상쾌한 휴식',
        baseColor: '#558B2F',
        available: true,
        ingredients: {
            cacao: {
                name: '카카오',
                emoji: '🫘',
                stats: { respiratory: 2, immunity: 6, digestion: 4, energy: 5, relaxation: 9 },
                flavor: { sweet: 2, bitter: 5, nutty: 10, body: 9, aroma: 6 },
                color: '#5D4037'
            },
            matcha: {
                name: '제주 녹차',
                emoji: '🍵',
                stats: { respiratory: 5, immunity: 8, digestion: 9, energy: 5, relaxation: 8 },
                flavor: { sweet: 3, bitter: 6, nutty: 5, body: 5, aroma: 7 },
                color: '#228B22'
            },
            mint: {
                name: '페퍼민트',
                emoji: '🌿',
                stats: { respiratory: 9, immunity: 4, digestion: 10, energy: 7, relaxation: 9 },
                flavor: { sweet: 1, bitter: 2, nutty: 0, body: 1, aroma: 10 },
                color: '#00FF7F'
            }
        }
    }
}

// 라벨 상수
const STAT_LABELS = { respiratory: '호흡기', immunity: '면역력', digestion: '소화', energy: '에너지', relaxation: '릴렉스' }
const FLAVOR_LABELS = { sweet: '단맛', bitter: '쓴맛', nutty: '고소함', body: '바디감', aroma: '향' }
const FLAVOR_COLORS = ['#F472B6', '#FB923C', '#A78BFA', '#38BDF8', '#4ADE80']

// 슬라이더 컴포넌트
function Slider({ label, value, onChange, color, emoji }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <span className="text-white/80 text-sm w-14 flex-shrink-0">{label}</span>
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onInput={(e) => onChange(Number(e.target.value))}
                className="flex-1 h-5 slider-custom"
                style={{ cursor: 'pointer', '--slider-color': color }}
            />
            <span
                className="px-2 py-0.5 rounded-full text-xs font-bold w-12 text-center flex-shrink-0"
                style={{ backgroundColor: `${color}33`, color: color }}
            >
                {value}%
            </span>
        </div>
    )
}

function App() {
    // 현재 선택된 티 제품
    const [selectedTea, setSelectedTea] = useState('british')

    // 슬라이더 값 (3개 재료)
    const [values, setValues] = useState({ slot1: 30, slot2: 20, slot3: 50 })

    // 현재 티 제품 데이터
    const currentTea = TEA_PRODUCTS[selectedTea]
    const ingredientKeys = Object.keys(currentTea.ingredients)

    // 탭 클릭 핸들러
    const handleTabClick = (teaId) => {
        const tea = TEA_PRODUCTS[teaId]
        if (!tea.available) {
            alert('🍵 곧 출시될 예정입니다!')
            return
        }
        setSelectedTea(teaId)
        setValues({ slot1: 30, slot2: 20, slot3: 50 }) // 초기화
    }

    // 동적 색상 계산
    const liquidColor = useMemo(() => {
        if (!currentTea.available || ingredientKeys.length === 0) {
            return 'rgba(200, 200, 200, 0.3)'
        }

        const total = values.slot1 + values.slot2 + values.slot3
        if (total === 0) return 'rgba(255, 250, 240, 0.3)'

        const ing = currentTea.ingredients
        const keys = ingredientKeys

        // 각 재료의 색상을 RGB로 변환
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 200, g: 200, b: 200 }
        }

        const colors = [
            hexToRgb(ing[keys[0]]?.color || '#CCCCCC'),
            hexToRgb(ing[keys[1]]?.color || '#CCCCCC'),
            hexToRgb(ing[keys[2]]?.color || '#CCCCCC')
        ]
        const weights = [values.slot1 / 100, values.slot2 / 100, values.slot3 / 100]

        const r = Math.round(colors[0].r * weights[0] * 0.4 + colors[1].r * weights[1] * 0.35 + colors[2].r * weights[2] * 0.35 + 25)
        const g = Math.round(colors[0].g * weights[0] * 0.4 + colors[1].g * weights[1] * 0.35 + colors[2].g * weights[2] * 0.35 + 20)
        const b = Math.round(colors[0].b * weights[0] * 0.4 + colors[1].b * weights[1] * 0.35 + colors[2].b * weights[2] * 0.35 + 15)
        const opacity = 0.3 + (total / 300) * 0.55

        return `rgba(${Math.min(r, 255)}, ${Math.min(g, 255)}, ${Math.min(b, 255)}, ${opacity})`
    }, [currentTea, ingredientKeys, values])

    // 건강 밸런스 데이터
    const healthData = useMemo(() => {
        if (!currentTea.available || ingredientKeys.length === 0) {
            return Object.keys(STAT_LABELS).map(key => ({ stat: STAT_LABELS[key], value: 0, fullMark: 10 }))
        }

        const total = values.slot1 + values.slot2 + values.slot3
        if (total === 0) {
            return Object.keys(STAT_LABELS).map(key => ({ stat: STAT_LABELS[key], value: 0, fullMark: 10 }))
        }

        const ing = currentTea.ingredients
        const keys = ingredientKeys
        const vals = [values.slot1, values.slot2, values.slot3]

        return Object.keys(STAT_LABELS).map(statKey => {
            let weightedSum = 0
            keys.forEach((key, i) => {
                weightedSum += (ing[key]?.stats[statKey] || 0) * vals[i]
            })
            return { stat: STAT_LABELS[statKey], value: Math.round((weightedSum / total) * 10) / 10, fullMark: 10 }
        })
    }, [currentTea, ingredientKeys, values])

    // 맛 프로필 데이터
    const flavorData = useMemo(() => {
        if (!currentTea.available || ingredientKeys.length === 0) {
            return Object.keys(FLAVOR_LABELS).map(key => ({ name: FLAVOR_LABELS[key], value: 0 }))
        }

        const total = values.slot1 + values.slot2 + values.slot3
        if (total === 0) {
            return Object.keys(FLAVOR_LABELS).map(key => ({ name: FLAVOR_LABELS[key], value: 0 }))
        }

        const ing = currentTea.ingredients
        const keys = ingredientKeys
        const vals = [values.slot1, values.slot2, values.slot3]

        return Object.keys(FLAVOR_LABELS).map(flavorKey => {
            let weightedSum = 0
            keys.forEach((key, i) => {
                weightedSum += (ing[key]?.flavor[flavorKey] || 0) * vals[i]
            })
            return { name: FLAVOR_LABELS[flavorKey], value: Math.round((weightedSum / total) * 10) / 10 }
        })
    }, [currentTea, ingredientKeys, values])

    return (
        <div className="min-h-screen flex flex-col items-center justify-start py-4 px-3 md:py-6 md:px-6 overflow-x-hidden">
            {/* 헤더 */}
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-1 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400">
                🍵 티 블렌딩 시뮬레이션
            </h1>
            <p className="text-white/60 mb-4 text-center text-xs md:text-sm">{currentTea.desc}</p>

            {/* 탭 메뉴 */}
            <div className="flex gap-2 mb-4 flex-wrap justify-center">
                {Object.values(TEA_PRODUCTS).map((tea) => (
                    <button
                        key={tea.id}
                        onClick={() => handleTabClick(tea.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedTea === tea.id
                            ? 'bg-amber-500 text-white shadow-lg'
                            : tea.available
                                ? 'bg-white/10 text-white/70 hover:bg-white/20'
                                : 'bg-white/5 text-white/30 cursor-not-allowed'
                            }`}
                    >
                        {tea.name}
                    </button>
                ))}
            </div>

            {/* 메인: 티팟 + 차트 */}
            <div className="flex flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-3xl mb-4">
                {/* 티팟 */}
                <div className="relative flex-shrink-0">
                    <div
                        className="absolute inset-0 blur-3xl opacity-40 rounded-full"
                        style={{ backgroundColor: liquidColor, transform: 'scale(0.6)' }}
                    />
                    <div className="teapot-container-small float-animation glow-effect">
                        <div className="liquid-layer-small" style={{ backgroundColor: liquidColor }} />
                        <div className="teapot-overlay-small" />
                    </div>
                </div>

                {/* 차트들 */}
                <div className="flex flex-col gap-2">
                    {/* 건강 밸런스 */}
                    <div className="glass-card p-2">
                        <h3 className="text-white/80 text-xs font-medium mb-1 text-center">💪 건강 밸런스</h3>
                        <div className="w-28 h-28 md:w-32 md:h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={healthData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                                    <PolarAngleAxis dataKey="stat" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 8 }} tickLine={false} />
                                    <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} />
                                    <Radar dataKey="value" stroke="#F59E0B" strokeWidth={2} fill="url(#goldGradient)" fillOpacity={0.5} isAnimationActive={true} animationDuration={200} />
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

                    {/* 맛 프로필 */}
                    <div className="glass-card p-2">
                        <h3 className="text-white/80 text-xs font-medium mb-1 text-center">📊 맛 프로필</h3>
                        <div className="w-28 h-28 md:w-32 md:h-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={flavorData} layout="vertical" margin={{ top: 0, right: 5, bottom: 0, left: 0 }}>
                                    <XAxis type="number" domain={[0, 10]} hide />
                                    <YAxis type="category" dataKey="name" width={28} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 7 }} axisLine={false} tickLine={false} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} isAnimationActive={true} animationDuration={200}>
                                        {flavorData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={FLAVOR_COLORS[index]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* 슬라이더 */}
            <div className="glass-card p-3 w-full max-w-md">
                <div className="flex items-center gap-2 mb-2">
                    <span>🎨</span>
                    <span className="text-sm font-semibold text-white">재료 조절</span>
                    <div className="ml-auto w-5 h-5 rounded-full shadow border border-white/20" style={{ backgroundColor: liquidColor }} />
                </div>
                <div className="space-y-2">
                    {ingredientKeys.map((key, index) => {
                        const ing = currentTea.ingredients[key]
                        const slotKey = `slot${index + 1}`
                        return (
                            <Slider
                                key={key}
                                label={ing.name}
                                value={values[slotKey]}
                                onChange={(v) => setValues(prev => ({ ...prev, [slotKey]: v }))}
                                color={ing.color}
                                emoji={ing.emoji}
                            />
                        )
                    })}
                </div>
            </div>

            {/* 푸터 */}
            <p className="mt-6 text-white/30 text-xs">🍃 Detox Tea Blending Studio</p>
        </div>
    )
}

export default App
