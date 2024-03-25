import logger from '@utils/logger';
import React, { useEffect, useState, useCallback } from 'react';

// https://wangdoc.com/javascript/dom/mutationobserver
const DEFAULT_OPTIONS = {
  // attributeFilter: ['style'],
  // attributeOldValue:false,
  attributes: true,
  // characterData:false,
  characterDataOldValue: false,
  childList: true,
  subtree: true,
};

export type HookFnType = (
  par1: MutationRecord[],
  par2: MutationObserver,
  ...par3: any[]
) => void;

const useObserver = (
  element: Node | null,
  fn: HookFnType,
  options: MutationObserverInit = DEFAULT_OPTIONS,
  deps?: any[]
) => {
  const [observer, setObserver] = useState<MutationObserver | null>(null);
  const [state, setState] = useState<
    [MutationRecord[], MutationObserver] | null
  >(null);

  logger.trace('useObserver render.', deps);

  // 监听 options ，创建 新MutationObserver
  useEffect(() => {
    if (!fn || typeof fn !== 'function') {
      console.warn(`${fn} is not function`);
      return;
    }

    logger.trace('useObserver create MutationObserver.');
    const observer = new MutationObserver((mutationRecord, observer) => {
      setState([mutationRecord, observer]);
    });
    setObserver(observer);
  }, [options, setObserver]);

  //
  useEffect(() => {
    if (!observer || !element) {
      return;
    }

    if (!(element instanceof Node)) {
      console.warn(`${element} is not Node`);
      return;
    }

    if (observer) {
      logger.trace('useObserver observer disconnect.');
      observer.disconnect();
    }

    logger.trace('useObserver observe.');
    observer.observe(element, options);

    // 此处卸载,清除资源
    return () => {
      logger.trace('useObserver unmount.');
      if (observer) {
        observer.disconnect();
        setObserver(null);
      }
    };
  }, [observer, element, options]);

  // 监听 state 变化，执行自定义函数
  useEffect(() => {
    logger.trace('useObserver effect.state:', deps);
    if (!state || state?.length < 1) {
      return;
    }
    if (deps && deps?.length > 1) {
      fn(...state, ...deps);
    } else {
      fn(...state);
    }
  }, [state]);
};

export default useObserver;
