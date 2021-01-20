import styled from 'styled-components';

const ToolTip = styled.div`
  .tooltip {
    list-style: none;
    position: relative;
    z-index: 1;
  }
  .tooltip:before,
  .tooltip:after {
    display: block;
    opacity: 0;
    pointer-events: none;
    position: absolute;
  }
  /* .tooltip:after {
    border-right: 6px solid transparent;
    border-bottom: 14px solid rgba(0, 0, 0, 0.75);
    border-left: 6px solid transparent;
    content: '';
    height: 0;
    left: 100px;
    width: 0;
  } */
  .tooltip:before {
    background: rgba(0, 0, 0, 0.75);
    border-radius: 2px;
    color: #fff;
    content: attr(data-title);
    font-size: 14px;
    padding: 6px 10px;
    top: 30px;
    white-space: nowrap;
  }

  /* the animations */
  /* fade */
  .tooltip.fade:after,
  .tooltip.fade:before {
    transform: translate3d(0, -10px, 0);
    transition: all 0.15s ease-in-out;
  }
  .tooltip.fade:hover:after,
  .tooltip.fade:hover:before {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;
export default ToolTip;
