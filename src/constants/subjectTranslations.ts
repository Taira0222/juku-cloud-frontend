import {
  IconAlphabetLatin,
  IconBook,
  IconMap,
  IconMathSymbols,
  IconMicroscope,
  type TablerIcon,
} from '@tabler/icons-react';

type SubjectTranslation = {
  name: string;
  icon: TablerIcon;
  color: string;
};

export const SUBJECT_TRANSLATIONS: Record<string, SubjectTranslation> = {
  Mathematics: {
    name: '数学',
    icon: IconMathSymbols,
    color: 'bg-blue-100',
  },
  English: {
    name: '英語',
    icon: IconAlphabetLatin,
    color: 'bg-purple-100',
  },
  Japanese: {
    name: '国語',
    icon: IconBook,
    color: 'bg-red-100',
  },
  Science: {
    name: '理科',
    icon: IconMicroscope,
    color: 'bg-green-100',
  },
  'Social Studies': {
    name: '社会',
    icon: IconMap,
    color: 'bg-yellow-100',
  },
};
