import { Course, TechCategoryMeta } from '@/types/quiz';
import { TECH_ADMIN_COURSE } from './tech_admin';
import { TECH_HYGIENE_COURSE } from './tech_hygiene';
import { TECH_MANAGEMENT_COURSE } from './tech_management';
import { TECH_PLANNING_COURSE } from './tech_planning';
import { TECH_HYDRAULICS_COURSE } from './tech_hydraulics';
import { TECH_INTAKE_STORAGE_COURSE } from './tech_intake_storage';
import { TECH_CONVEYANCE_DISTRIBUTION_COURSE } from './tech_conveyance_distribution';
import { TECH_CIVIL_MATERIALS_COURSE } from './tech_civil_materials';
import { TECH_PURIFICATION_COURSE } from './tech_purification';

export const TECH_CATEGORIES: TechCategoryMeta[] = [
  {
    id: 'all',
    name: '全講義一覧',
    shortName: '全18講義',
    badge: '全18講義',
    description: '水道技術管理者に求められる全18分野を体系別に網羅した総合ロードマップ',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'legal_planning',
    name: 'Ⅰ. 法規・衛生・経営・計画',
    shortName: '法規・経営・計画',
    badge: '4講義',
    description: '水道行政、公衆衛生、公営企業会計・財務経営、水需要予測と施設計画',
    color: 'from-blue-700 via-indigo-700 to-blue-900',
  },
  {
    id: 'facility_hydraulics',
    name: 'Ⅱ. 水理・構造・施設・管路',
    shortName: '水理・施設・管路',
    badge: '4講義',
    description: '水道水理学・構造力学、水源・取水・貯水、導送配水施設、漏水防止、土木材料施工',
    color: 'from-sky-600 via-blue-600 to-indigo-800',
  },
  {
    id: 'purification_machinery',
    name: 'Ⅲ. 浄水処理・機電・管資材',
    shortName: '浄水・機電・資材',
    badge: '5講義',
    description: '浄水施設、機械・電気設備、監視計装SCADA、ダクタイル鉄管、バルブ特性と維持管理',
    color: 'from-indigo-600 via-violet-600 to-purple-800',
  },
  {
    id: 'water_quality_service',
    name: 'Ⅳ. 給水装置・水質・生物',
    shortName: '給水・水質・生物',
    badge: '5講義',
    description: '給水装置、水質概論・基準、水源原水浄水水質、送配給水水質（異常時対応）、微生物・生物概論',
    color: 'from-teal-600 via-cyan-600 to-emerald-700',
  },
];

export const TECH_MANAGER_COURSES: Course[] = [
  // =========================================================================
  // Ⅰ. 法規・衛生・経営・計画 (4講義)
  // =========================================================================
  TECH_ADMIN_COURSE,
  TECH_HYGIENE_COURSE,
  TECH_MANAGEMENT_COURSE,
  TECH_PLANNING_COURSE,

  // =========================================================================
  // Ⅱ. 水理・構造・施設・管路 (4講義)
  // =========================================================================
  TECH_HYDRAULICS_COURSE,
  TECH_INTAKE_STORAGE_COURSE,
  TECH_CONVEYANCE_DISTRIBUTION_COURSE,
  TECH_CIVIL_MATERIALS_COURSE,

  // =========================================================================
  // Ⅲ. 浄水処理・機電・管資材 (5講義)
  // =========================================================================
  TECH_PURIFICATION_COURSE,
  {
    id: 'tech_machinery_electrical',
    domainId: 'water_technical_manager',
    title: '機械・電気設備',
    subtitle: 'ポンプ設備・受変電設備・自家発電設備・電動機・動力計算・保安管理',
    description: '遠心ポンプ・立軸斜流ポンプの選定と揚程・軸動力計算、キャビテーション防止、高圧・特高受変電設備、非常用自家発電機と燃料備蓄基準を押さえます。',
    iconName: 'Zap',
    themeColor: 'from-amber-600 to-blue-800',
    category: 'purification_machinery',
    fieldNumber: 10,
    badge: '機電設備',
    estimatedQuestions: 160,
    keywords: ['渦巻ポンプ', '全揚程・軸動力', 'キャビテーション', '受変電設備', '自家用発電設備'],
    units: [],
  },
  {
    id: 'tech_instrumentation',
    domainId: 'water_technical_manager',
    title: '計装設備',
    subtitle: 'SCADA監視制御・テレメータ・流量計・水質計器・サイバーセキュリティ・経済安保',
    description: '超音波流量計・電磁流量計、残留塩素計・濁度計などのオンライン水質計器、SCADA遠隔制御、計装通信回線、経済安全保障推進法に基づく基幹インフラ防護を学びます。',
    iconName: 'MonitorCheck',
    themeColor: 'from-indigo-700 to-slate-800',
    category: 'purification_machinery',
    fieldNumber: 11,
    badge: '監視計装',
    estimatedQuestions: 140,
    keywords: ['SCADA', '電磁流量計', 'オンライン水質計', 'テレメータ', '経済安保事前審査'],
    units: [],
  },
  {
    id: 'tech_ductile_iron_pipe',
    domainId: 'water_technical_manager',
    title: '水道用ダクタイル鉄管の製造工程と施工管理',
    subtitle: '耐震継手（NS形・S50形・GX形）・遠心力鋳造・防食塗装・布設接合実務',
    description: '球状黒鉛鋳鉄の材質特性、耐震継手の屈曲・離脱防止機能（S-1/S-2/A級）、内面エポキシ・外面耐食塗装、埋設施工時の許容曲げ角度と押角管理を習得します。',
    iconName: 'Cog',
    themeColor: 'from-slate-700 to-blue-900',
    category: 'purification_machinery',
    fieldNumber: 12,
    badge: '鉄管耐震',
    estimatedQuestions: 130,
    keywords: ['ダクタイル鉄管', 'NS形/GX形継手', '耐震適合管', '離脱防止', 'モルタルライニング'],
    units: [],
  },
  {
    id: 'tech_valves',
    domainId: 'water_technical_manager',
    title: '水道用バルブの特性と維持管理',
    subtitle: '仕切弁・バタフライ弁・空気弁・減圧弁・逆止弁の構造と操作・定期点検',
    description: '各種バルブの流体特性と閉止トルク、急速空気弁の吸排気機能、水撃防止逆止弁、減圧弁による圧力制御、弁室構造と定期点検・操作不良対策を整理します。',
    iconName: 'Wrench',
    themeColor: 'from-blue-700 to-slate-800',
    category: 'purification_machinery',
    fieldNumber: 13,
    badge: '弁類実務',
    estimatedQuestions: 120,
    keywords: ['仕切弁（ゲート弁）', 'バタフライ弁', '急速空気弁', '減圧弁', '水撃圧逆止弁'],
    units: [],
  },

  // =========================================================================
  // Ⅳ. 給水装置・水質・生物 (5講義)
  // =========================================================================
  {
    id: 'tech_service_pipes',
    domainId: 'water_technical_manager',
    title: '給水装置',
    subtitle: '給水装置の構造材質基準・直結給水・クロスコネクション厳禁・メーター・指定工事業者',
    description: '水道法第16条・17条の需要者管理原則、指定給水装置工事事業者制度（5年更新制）、直結増圧給水の設計基準、逆流防止装置、メーター検定満了（8年）管理を網羅します。',
    iconName: 'Wrench',
    themeColor: 'from-blue-600 to-cyan-700',
    category: 'water_quality_service',
    fieldNumber: 14,
    badge: '給水装置',
    estimatedQuestions: 170,
    keywords: ['指定給水装置工事事業者', 'クロスコネクション', '直結増圧式', '逆流防止器', 'メーター8年検定'],
    units: [],
  },
  {
    id: 'tech_water_quality_intro',
    domainId: 'water_technical_manager',
    title: '水質概論',
    subtitle: '水質基準51項目・水質管理目標設定項目・PFAS（PFOS/PFOA）・毒性評価・検査法',
    description: '健康影響項目（31項目）と性状項目（20項目）の基準値設定根拠、TDI算出法、PFASの暫定目標値（合算50ng/L）、水質検査計画の策定指針と水道GLPを学びます。',
    iconName: 'TestTube',
    themeColor: 'from-teal-700 to-cyan-800',
    category: 'water_quality_service',
    fieldNumber: 15,
    badge: '★水質基礎',
    estimatedQuestions: 180,
    keywords: ['水質基準51項目', 'PFOS/PFOA', 'TDI（耐容一日摂取量）', '水質検査計画', '水道GLP'],
    units: [],
  },
  {
    id: 'tech_water_quality_purification',
    domainId: 'water_technical_manager',
    title: '水源・原水及び浄水処理の水質管理',
    subtitle: '富栄養化・トリハロメタン生成能・農薬類・微量有機物質・凝集阻害対策',
    description: 'ダム湖・河川水の藻類増殖（かび臭・毒素）、塩素処理副生成物（総トリハロメタン・ハロ酢酸）の低減策、水安全計画（WSP）による危害要因管理を徹底習得します。',
    iconName: 'Sparkles',
    themeColor: 'from-cyan-700 to-teal-800',
    category: 'water_quality_service',
    fieldNumber: 16,
    badge: '浄水水質',
    estimatedQuestions: 150,
    keywords: ['かび臭物質（2-MIB/ジェオスミン）', '総トリハロメタン', '水安全計画（WSP）', 'ジャーテスト', '凝集阻害'],
    units: [],
  },
  {
    id: 'tech_water_quality_distribution',
    domainId: 'water_technical_manager',
    title: '送配水・給水の水質管理（水質異常時の対応含む）',
    subtitle: '残留塩素保持・赤水黒水濁水対策・管路滞留水質変化・水質事故緊急対応マニュアル',
    description: '給水栓における遊離残留塩素0.1mg/L（結合0.4mg/L）の保持、配水管末端の残留塩素低下対策、停電・断水後の赤水フラッシング手順、油流入・毒劇物混入時の緊急給水停止を学びます。',
    iconName: 'ShieldAlert',
    themeColor: 'from-red-600 to-blue-800',
    category: 'water_quality_service',
    fieldNumber: 17,
    badge: '異常時対応',
    estimatedQuestions: 160,
    keywords: ['残留塩素0.1mg/L', '赤水・黒水', '管網滞留時間', '水質異常時マニュアル', '給水停止判断'],
    units: [],
  },
  {
    id: 'tech_microbiology',
    domainId: 'water_technical_manager',
    title: '微生物・生物概論',
    subtitle: '病原微生物・大腸菌・指標菌・クリプトスポリジウム・ジアルジア・生物障害',
    description: '一般細菌・大腸菌の検査意義、耐塩素性病原原虫（クリプトスポリジウム・ジアルジア）のオーシスト特性、ユスリカ等の生物障害対策、生物相観察実務をマスターします。',
    iconName: 'HeartPulse',
    themeColor: 'from-emerald-700 to-teal-900',
    category: 'water_quality_service',
    fieldNumber: 18,
    badge: '生物試験',
    estimatedQuestions: 140,
    keywords: ['一般細菌', '大腸菌群', 'クリプトスポリジウム', 'オーシスト', '生物障害', '顕微鏡検査'],
    units: [],
  },
];
