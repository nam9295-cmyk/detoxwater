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
            cacao: {
                name: '카카오',
                emoji: '🫘',
                stats: { respiratory: 2, immunity: 6, digestion: 4, energy: 5, relaxation: 9 },
                flavor: { sweet: 3, bitter: 5, nutty: 10, body: 9, aroma: 6 },
                color: '#8B4513'
            },
            doraji: {
                name: '도라지',
                emoji: '🌾',
                stats: { respiratory: 10, immunity: 8, digestion: 5, energy: 3, relaxation: 4 },
                flavor: { sweet: 2, bitter: 8, nutty: 5, body: 4, aroma: 3 },
                color: '#E8D4A8'
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
        <div className="flex items-center gap-3">
            <span className="text-xl filter drop-shadow-sm">{emoji}</span>
            <span className="text-[#3E2723] font-medium text-sm w-16 flex-shrink-0 font-sans tracking-wide">{label}</span>
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onInput={(e) => onChange(Number(e.target.value))}
                className="flex-1 h-6 cursor-pointer"
            />
            <span
                className="px-2 py-1 rounded-full text-xs font-bold w-12 text-center flex-shrink-0 shadow-sm"
                style={{ backgroundColor: '#fff', color: '#3E2723', border: '1px solid #E0E0E0' }}
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
        <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 md:py-12 md:px-8 overflow-x-hidden bg-[#F9F5F0]">
            {/* 헤더 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3E2723] mb-2 text-center font-serif tracking-tight">
                Very Good Chocolate
            </h1>
            <p className="text-[#3E2723]/70 mb-8 text-center text-sm md:text-base font-sans tracking-wide">
                {currentTea.desc}
            </p>

            {/* 탭 메뉴 */}
            <div className="flex gap-3 mb-8 flex-wrap justify-center">
                {Object.values(TEA_PRODUCTS).map((tea) => (
                    <button
                        key={tea.id}
                        onClick={() => handleTabClick(tea.id)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 font-sans tracking-wide ${selectedTea === tea.id
                            ? 'bg-[#3E2723] text-[#D4AF37] shadow-lg transform scale-105'
                            : tea.available
                                ? 'bg-white border border-[#D4AF37]/30 text-[#3E2723]/70 hover:bg-[#D4AF37]/10 hover:text-[#3E2723] hover:border-[#D4AF37]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {tea.name}
                    </button>
                ))}
            </div>

            {/* 메인: 티팟 + 차트 */}
            <div className="flex flex-row items-center justify-center gap-6 md:gap-12 w-full max-w-4xl mb-8">
                {/* 티팟 */}
                <div className="relative flex-shrink-0">
                    <div
                        className="absolute inset-0 blur-3xl opacity-30 rounded-full"
                        style={{ backgroundColor: liquidColor, transform: 'scale(0.7)' }}
                    />
                    <div className="teapot-container-small float-animation">
                        <div className="liquid-layer-small" style={{ backgroundColor: liquidColor }} />
                        <div className="teapot-overlay-small" />
                    </div>
                </div>

                {/* 차트들 */}
                <div className="flex flex-col gap-4">
                    {/* 건강 밸런스 */}
                    <div className="glass-panel p-4">
                        <h3 className="text-[#3E2723] text-sm font-serif font-bold mb-2 text-center">Health Balance</h3>
                        <div className="w-32 h-32 md:w-36 md:h-36">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={healthData}>
                                    <PolarGrid stroke="#D4AF37" strokeOpacity={0.3} />
                                    <PolarAngleAxis dataKey="stat" tick={{ fill: '#5D4037', fontSize: 10, fontWeight: 500 }} tickLine={false} />
                                    <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} axisLine={false} />
                                    <Radar dataKey="value" stroke="#D4AF37" strokeWidth={2} fill="#D4AF37" fillOpacity={0.4} isAnimationActive={true} animationDuration={200} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 맛 프로필 */}
                    <div className="glass-panel p-4">
                        <h3 className="text-[#3E2723] text-sm font-serif font-bold mb-2 text-center">Flavor Profile</h3>
                        <div className="w-32 h-32 md:w-36 md:h-36">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={flavorData} layout="vertical" margin={{ top: 0, right: 5, bottom: 0, left: 0 }}>
                                    <XAxis type="number" domain={[0, 10]} hide />
                                    <YAxis type="category" dataKey="name" width={32} tick={{ fill: '#5D4037', fontSize: 9, fontWeight: 500 }} axisLine={false} tickLine={false} />
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
            <div className="glass-panel p-6 w-full max-w-lg shadow-2xl">
                <div className="flex items-center gap-2 mb-4 border-b border-[#D4AF37]/20 pb-2">
                    <span className="text-xl">👩‍🍳</span>
                    <span className="text-base font-bold text-[#3E2723] font-serif">Blending Control</span>
                    <div className="ml-auto w-6 h-6 rounded-full shadow-inner border border-[#3E2723]/10" style={{ backgroundColor: liquidColor }} />
                </div>
                <div className="space-y-4">
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
            <div className="mt-12 text-[#3E2723]/40 text-xs font-serif flex items-center gap-2">
                <span>Very Good Chocolate Studio</span>
                <span className="block w-1 h-1 rounded-full bg-[#D4AF37]"></span>
                <span>Est. 2024</span>
            </div>
        </div>
    )
}

export default App
