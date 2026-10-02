import { Course } from '@/types/quiz';
import { TECH_CIVIL_MATERIALS_UNIT_1 } from './unit_1';
import { TECH_CIVIL_MATERIALS_UNIT_2 } from './unit_2';
import { TECH_CIVIL_MATERIALS_UNIT_3 } from './unit_3';
import { TECH_CIVIL_MATERIALS_UNIT_4 } from './unit_4';

export const TECH_CIVIL_MATERIALS_COURSE: Course = {
  id: 'tech_civil_materials',
  domainId: 'water_technical_manager',
  title: '土木材料及び施工法・水道資材',
  subtitle: '土木材料工学・土留め安全基準・配管布設実務・非開削特殊工法・JWWA資材規格',
  description: '水道技術管理者の法定責務、土木材料の性質、コンクリート施工管理、土留め安全基準、配管布設とスラスト防護、非開削工法、ダクタイル耐震継手とバルブ分類を学びます。',
  iconName: 'HardHat',
  themeColor: 'from-amber-700 to-slate-800',
  category: 'facility_hydraulics',
  fieldNumber: 8,
  badge: '土木施工',
  estimatedQuestions: 140,
  keywords: [
    '水道技術管理者責務',
    '土木材料分類',
    'コンクリート長所短所',
    'RC成立理由',
    '土留め安全基準',
    'コンクリート打込み時間',
    '配管2点吊り',
    '管の二重明示',
    '推進工法',
    'ダクタイル耐震継手',
    'バルブ分類体系'
  ],
  units: [
    TECH_CIVIL_MATERIALS_UNIT_1,
    TECH_CIVIL_MATERIALS_UNIT_2,
    TECH_CIVIL_MATERIALS_UNIT_3,
    TECH_CIVIL_MATERIALS_UNIT_4,
  ],
};
