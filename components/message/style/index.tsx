// deps-lint-skip-all
import type { CSSObject } from '@ant-design/cssinjs';
import { Keyframes } from '@ant-design/cssinjs';
import { resetComponent } from '../../style';
import type { FullToken, GenerateStyle } from '../../theme/internal';
import { genComponentStyleHook, mergeToken } from '../../theme/internal';

/** Component only token. Which will handle additional calculation of alias token */
export interface ComponentToken {
  // Component token here
  height: number;
  zIndexPopup: number;
  messageNoticeContentBg: string;
  messageNoticeContentPadding: string;
}

interface MessageToken extends FullToken<'Message'> {
  // Custom token here
}

const genMessageStyle: GenerateStyle<MessageToken> = (token) => {
  const {
    componentCls,
    iconCls,
    boxShadow,
    colorText,
    colorBgElevated,
    colorSuccess,
    colorError,
    colorWarning,
    colorInfo,
    fontSizeLG,
    motionEaseInOutCirc,
    motionDurationSlow,
    marginXS,
    paddingXS,
    borderRadiusLG,
    zIndexPopup,
    // Custom token
    messageNoticeContentPadding,
  } = token;

  const noticeCls = `${componentCls}-notice`;

  const messageMoveIn = new Keyframes('MessageMoveIn', {
    '0%': {
      padding: 0,
      transform: 'translateY(-100%)',
      opacity: 0,
    },

    '100%': {
      padding: paddingXS,
      transform: 'translateY(0)',
      opacity: 1,
    },
  });

  const messageMoveOut = new Keyframes('MessageMoveOut', {
    '0%': {
      maxHeight: token.height,
      padding: paddingXS,
      opacity: 1,
    },
    '100%': {
      maxHeight: 0,
      padding: 0,
      opacity: 0,
    },
  });

  const noticeStyle: CSSObject = {
    padding: paddingXS,
    textAlign: 'center',

    [`${componentCls}-custom-content > ${iconCls}`]: {
      verticalAlign: 'text-bottom',
      marginInlineEnd: marginXS, // affected by ltr or rtl
      fontSize: fontSizeLG,
    },

    [`${noticeCls}-content`]: {
      display: 'inline-block',
      padding: messageNoticeContentPadding,
      background: colorBgElevated,
      borderRadius: borderRadiusLG,
      boxShadow,
      pointerEvents: 'all',
    },

    [`${componentCls}-success > ${iconCls}`]: {
      color: colorSuccess,
    },
    [`${componentCls}-error > ${iconCls}`]: {
      color: colorError,
    },
    [`${componentCls}-warning > ${iconCls}`]: {
      color: colorWarning,
    },
    [`${componentCls}-info > ${iconCls},
      ${componentCls}-loading > ${iconCls}`]: {
      color: colorInfo,
    },
  };

  return [
    // ============================ Holder ============================
    {
      [componentCls]: {
        ...resetComponent(token),
        color: colorText,
        position: 'fixed',
        top: marginXS,
        width: '100%',
        pointerEvents: 'none',
        zIndex: zIndexPopup,

        [`${componentCls}-move-up`]: {
          animationFillMode: 'forwards',
        },
        [`
        ${componentCls}-move-up-appear,
        ${componentCls}-move-up-enter
      `]: {
          animationName: messageMoveIn,
          animationDuration: motionDurationSlow,
          animationPlayState: 'paused',
          animationTimingFunction: motionEaseInOutCirc,
        },
        [`
        ${componentCls}-move-up-appear${componentCls}-move-up-appear-active,
        ${componentCls}-move-up-enter${componentCls}-move-up-enter-active
      `]: {
          animationPlayState: 'running',
        },
        [`${componentCls}-move-up-leave`]: {
          animationName: messageMoveOut,
          animationDuration: motionDurationSlow,
          animationPlayState: 'paused',
          animationTimingFunction: motionEaseInOutCirc,
        },
        [`${componentCls}-move-up-leave${componentCls}-move-up-leave-active`]: {
          animationPlayState: 'running',
        },
        '&-rtl': {
          direction: 'rtl',
          span: {
            direction: 'rtl',
          },
        },
      },
    },

    // ============================ Notice ============================
    {
      [componentCls]: {
        [noticeCls]: {
          ...noticeStyle,
        },
      },
    },

    // ============================= Pure =============================
    {
      [`${componentCls}-notice-pure-panel`]: {
        ...noticeStyle,
        padding: 0,
        textAlign: 'start',
      },
    },
  ];
};

// ============================== Export ==============================
export default genComponentStyleHook(
  'Message',
  (token) => {
    // Gen-style functions here
    const combinedToken = mergeToken<MessageToken>(token, {});
    return [genMessageStyle(combinedToken)];
  },
  (token) => ({
    height: 150,
    zIndexPopup: token.zIndexPopupBase + 10,
    messageNoticeContentBg: token.colorBgElevated,
    messageNoticeContentPadding: `${
      (token.controlHeightLG - token.fontSize * token.lineHeight) / 2
    }px ${token.paddingSM}px`,
  }),
);
