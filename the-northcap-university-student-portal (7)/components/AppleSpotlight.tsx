
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  ChevronRight,
  Files,
  LayoutGrid,
  Search,
  StickyNote,
  BookOpen,
  GraduationCap,
  FileText,
  User,
  MessageSquare
} from 'lucide-react';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ViewState } from '../types';
import { COURSES, ASSIGNMENTS, EXAM_RESULTS } from '../constants';

interface Shortcut {
  label: string;
  icon: React.ReactNode;
  view: ViewState;
}

interface SearchResult {
  icon: React.ReactNode;
  label: string;
  description: string;
  view: ViewState;
}

const SVGFilter = () => {
  return (
    <svg width="0" height="0" className="absolute">
      <filter id="blob">
        <feGaussianBlur stdDeviation="10" in="SourceGraphic" />
        <feColorMatrix
          values="
      1 0 0 0 0
      0 1 0 0 0
      0 0 1 0 0
      0 0 0 18 -9
    "
          result="blob"
        />
        <feBlend in="SourceGraphic" in2="blob" />
      </filter>
    </svg>
  );
};

interface ShortcutButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ShortcutButton = ({ icon, label, onClick }: ShortcutButtonProps) => {
  return (
    <div 
      onClick={onClick}
      className="rounded-full cursor-pointer hover:shadow-lg opacity-40 hover:opacity-100 transition-[opacity,shadow] duration-200 bg-white p-4"
      title={label}
    >
      <div className="size-8 aspect-square flex items-center justify-center text-slate-800">
        {icon}
      </div>
    </div>
  );
};

interface SpotlightPlaceholderProps {
  text: string;
  className?: string;
}

const SpotlightPlaceholder = ({ text, className }: SpotlightPlaceholderProps) => {
  return (
    <motion.div
      layout
      className={cn('absolute text-slate-400 flex items-center pointer-events-none z-10', className)}
    >
      <AnimatePresence mode="popLayout">
        <motion.p
          layoutId={`placeholder-${text}`}
          key={`placeholder-${text}`}
          initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

interface SpotlightInputProps {
  placeholder: string;
  hidePlaceholder: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholderClassName?: string;
}

const SpotlightInput = ({
  placeholder,
  hidePlaceholder,
  value,
  onChange,
  placeholderClassName
}: SpotlightInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center w-full justify-start gap-4 px-6 h-20">
      <motion.div layoutId="search-icon">
        <Search className="text-slate-500 w-6 h-6" />
      </motion.div>
      <div className="flex-1 relative text-2xl">
        {!hidePlaceholder && (
          <SpotlightPlaceholder text={placeholder} className={placeholderClassName} />
        )}

        <motion.input
          ref={inputRef}
          layout="position"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none border-none ring-0 text-slate-800 placeholder-transparent"
        />
      </div>
    </div>
  );
};

interface SearchResultCardProps extends SearchResult {
  isLast: boolean;
  onClick: () => void;
}

const SearchResultCard = ({ icon, label, description, isLast, onClick }: SearchResultCardProps) => {
  return (
    <div 
      onClick={onClick} 
      className="overflow-hidden w-full group/card cursor-pointer"
    >
      <div
        className={cn(
          'flex items-center text-slate-800 justify-start hover:bg-white gap-4 py-3 px-4 rounded-xl hover:shadow-sm w-full transition-colors',
          isLast && 'rounded-b-3xl'
        )}
      >
        <div className="size-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover/card:bg-slate-50 group-hover/card:text-amber-600 transition-colors">
          {icon}
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-lg">{label}</p>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex-1 flex items-center justify-end opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 text-amber-500">
          <ChevronRight className="size-5" />
        </div>
      </div>
    </div>
  );
};

interface SearchResultsContainerProps {
  searchResults: SearchResult[];
  onHover: (index: number | null) => void;
  onSelect: (view: ViewState) => void;
}

const SearchResultsContainer = ({ searchResults, onHover, onSelect }: SearchResultsContainerProps) => {
  return (
    <motion.div
      layout
      onMouseLeave={() => onHover(null)}
      className="px-2 border-t border-slate-100 flex flex-col bg-slate-50/50 max-h-[400px] overflow-y-auto w-full py-2 custom-scrollbar"
    >
      {searchResults.length > 0 ? (
        searchResults.map((result, index) => (
          <motion.div
            key={`search-result-${index}`}
            onMouseEnter={() => onHover(index)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: index * 0.05,
              duration: 0.2,
              ease: 'easeOut'
            }}
          >
            <SearchResultCard
              {...result}
              isLast={index === searchResults.length - 1}
              onClick={() => onSelect(result.view)}
            />
          </motion.div>
        ))
      ) : (
        <div className="p-8 text-center text-slate-400">
            No results found
        </div>
      )}
    </motion.div>
  );
};

interface AppleSpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeView: (view: ViewState) => void;
}

export const AppleSpotlight = ({ isOpen, onClose, onChangeView }: AppleSpotlightProps) => {
  const [hovered, setHovered] = useState(false);
  const [hoveredSearchResult, setHoveredSearchResult] = useState<number | null>(null);
  const [hoveredShortcut, setHoveredShortcut] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');

  // Reset search when opened
  useEffect(() => {
    if (isOpen) setSearchValue('');
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const shortcuts: Shortcut[] = [
    { label: 'Dashboard', icon: <LayoutGrid />, view: ViewState.DASHBOARD },
    { label: 'Timetable', icon: <Calendar />, view: ViewState.TIMETABLE },
    { label: 'Exams', icon: <GraduationCap />, view: ViewState.EXAMS },
    { label: 'Assignments', icon: <Files />, view: ViewState.ASSIGNMENTS },
    { label: 'AI Helper', icon: <MessageSquare />, view: ViewState.AI_HELP },
  ];

  const searchResults = useMemo(() => {
    if (!searchValue.trim()) return [];
    const lowerQuery = searchValue.toLowerCase();
    const results: SearchResult[] = [];

    // Filter Courses
    COURSES.forEach(c => {
      if (c.name.toLowerCase().includes(lowerQuery) || c.code.toLowerCase().includes(lowerQuery)) {
        results.push({
          icon: <BookOpen className="w-6 h-6" />,
          label: c.name,
          description: `${c.code} • ${c.professor}`,
          view: ViewState.COURSES
        });
      }
    });

    // Filter Assignments
    ASSIGNMENTS.forEach(a => {
      if (a.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          icon: <StickyNote className="w-6 h-6" />,
          label: a.title,
          description: `Assignment • Due: ${a.dueDate}`,
          view: ViewState.ASSIGNMENTS
        });
      }
    });

    // Filter Exams
    EXAM_RESULTS.forEach(e => {
       const course = COURSES.find(c => c.id === e.courseId);
       if (course?.name.toLowerCase().includes(lowerQuery)) {
         results.push({
            icon: <Activity className="w-6 h-6" />,
            label: `${course.name} Result`,
            description: `Grade: ${e.grade}`,
            view: ViewState.EXAMS
         });
       }
    });

    // Static Navigation matches
    if ('attendance'.includes(lowerQuery)) {
        results.push({ icon: <Calendar className="w-6 h-6" />, label: 'Attendance', description: 'View detailed attendance', view: ViewState.ATTENDANCE });
    }
    if ('fees'.includes(lowerQuery) || 'payment'.includes(lowerQuery)) {
        results.push({ icon: <FileText className="w-6 h-6" />, label: 'Fee Portal', description: 'Pay semester fees', view: ViewState.FEES });
    }
    if ('profile'.includes(lowerQuery)) {
        results.push({ icon: <User className="w-6 h-6" />, label: 'My Profile', description: 'View and edit profile', view: ViewState.PROFILE });
    }

    return results;
  }, [searchValue]);

  const handleShortcutClick = (view: ViewState) => {
    onChangeView(view);
    onClose();
  };

  const handleResultSelect = (view: ViewState) => {
    onChangeView(view);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-start pt-[15vh] bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <SVGFilter />

          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
              setHovered(false);
              setHoveredShortcut(null);
            }}
            onClick={(e) => e.stopPropagation()}
            style={{ filter: 'url(#blob)' }}
            className={cn(
              'w-full flex flex-col items-center justify-center gap-6 z-20 group relative px-4',
              'max-w-3xl'
            )}
          >
            {/* Shortcuts Row */}
            <div className="flex gap-4 mb-2">
            <AnimatePresence>
             {hovered && !searchValue && shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={`shortcut-${index}`}
                    onMouseEnter={() => setHoveredShortcut(index)}
                    layout
                    initial={{ scale: 0.7, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.7, opacity: 0, y: 10 }}
                    transition={{
                      duration: 0.4,
                      type: 'spring',
                      delay: index * 0.05
                    }}
                  >
                    <ShortcutButton 
                      icon={shortcut.icon} 
                      label={shortcut.label}
                      onClick={() => handleShortcutClick(shortcut.view)} 
                    />
                  </motion.div>
                ))}
             </AnimatePresence>
            </div>

            {/* Main Search Box */}
            <AnimatePresence mode="popLayout">
              <motion.div
                layoutId="search-input-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{
                  layout: {
                    duration: 0.5,
                    type: 'spring',
                    bounce: 0.2
                  }
                }}
                style={{
                  borderRadius: '24px'
                }}
                className="w-full bg-white flex flex-col items-center justify-start z-10 relative shadow-2xl overflow-hidden"
              >
                <SpotlightInput
                  placeholder={
                    hoveredShortcut !== null
                      ? shortcuts[hoveredShortcut].label
                      : hoveredSearchResult !== null
                      ? searchResults[hoveredSearchResult].label
                      : 'Search courses, assignments, exams...'
                  }
                  placeholderClassName={
                    hoveredSearchResult !== null ? 'text-slate-800' : 'text-slate-400'
                  }
                  hidePlaceholder={!(hoveredSearchResult !== null || !searchValue)}
                  value={searchValue}
                  onChange={setSearchValue}
                />

                {searchValue && (
                  <SearchResultsContainer
                    searchResults={searchResults}
                    onHover={setHoveredSearchResult}
                    onSelect={handleResultSelect}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
