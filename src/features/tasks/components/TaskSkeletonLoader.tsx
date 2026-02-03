/**
 * TASK SKELETON LOADER COMPONENT
 * Shimmer loading effect for maintaining layout stability
 */

import { motion } from 'framer-motion';

interface TaskSkeletonLoaderProps {
  count?: number;
  variant?: 'list' | 'kanban' | 'detail';
}

const shimmer = {
  initial: { backgroundPosition: '0% 0%' },
  animate: { backgroundPosition: '100% 0%' },
};

export function TaskSkeletonLoader({ count = 3, variant = 'list' }: TaskSkeletonLoaderProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {skeletons.map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-lg border border-slate-200 p-4"
          >
            <div className="flex items-center gap-4">
              {/* CHECKBOX SKELETON */}
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-6 h-6 rounded border-slate-300 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
              />

              {/* CONTENT SKELETON */}
              <div className="flex-1 space-y-2">
                {/* TITLE */}
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-4 w-2/3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
                />
                {/* DESCRIPTION */}
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                  className="h-3 w-1/2 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
                />
              </div>

              {/* BADGES SKELETON */}
              <div className="flex items-center gap-2">
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-6 w-12 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-full bg-[length:200%_100%]"
                />
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                  className="h-6 w-12 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-full bg-[length:200%_100%]"
                />
              </div>

              {/* AVATAR SKELETON */}
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'kanban') {
    return (
      <div className="flex gap-6 overflow-x-auto pb-4">
        {Array.from({ length: 4 }, (_, col) => (
          <div key={col} className="flex-shrink-0 w-80 space-y-3">
            {/* COLUMN HEADER */}
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-10 w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg bg-[length:200%_100%]"
            />

            {/* CARDS */}
            {skeletons.slice(0, 2).map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: (col + i) * 0.05 }}
                className="bg-white rounded-lg border border-slate-200 p-3 space-y-2"
              >
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="h-4 w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
                />
                <motion.div
                  variants={shimmer}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                  className="h-3 w-2/3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
                />
                <div className="flex gap-2 pt-2">
                  <motion.div
                    variants={shimmer}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-5 w-10 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // DETAIL VARIANT
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <motion.div
        variants={shimmer}
        initial="initial"
        animate="animate"
        transition={{ duration: 1.5, repeat: Infinity }}
        className="h-8 w-3/4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
      />

      {/* META GRID */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="space-y-2"
          >
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-4 w-1/3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
            />
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              className="h-6 w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
            />
          </motion.div>
        ))}
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-4 w-1/4 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
        />
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
          className="h-20 w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
        />
      </div>

      {/* COMMENTS SECTION */}
      <div className="border-t border-slate-200 pt-6 space-y-3">
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-4 w-1/3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
        />
        {Array.from({ length: 2 }, (_, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex gap-3">
            <motion.div
              variants={shimmer}
              initial="initial"
              animate="animate"
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 flex-shrink-0 bg-[length:200%_100%]"
            />
            <div className="flex-1 space-y-2">
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ duration: 1.5, repeat: Infinity }}
                className="h-4 w-1/3 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
              />
              <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                className="h-12 w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded bg-[length:200%_100%]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
