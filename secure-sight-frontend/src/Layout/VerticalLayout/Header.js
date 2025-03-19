import React, { useState } from "react";
import { connect } from "react-redux";
import LanguageDropdown from "../../components/Common/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../../components/Common/TopbarDropdown/NotificationDropdown";
import { withTranslation } from "react-i18next";
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions";
import ProfileMenu from "../../components/Common/TopbarDropdown/ProfileMenu";
import eventusLogoHorizontal from "../../assets/images/eventus_logo_horizontal.png"
import "./logo.css";

// Create a style element for the keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes textclip {
  to {
    background-position: 200% center;
  }
}

.secure-sight-title {
  background-image: linear-gradient(
    -225deg,
    #ffccff 0%,
    #b3a0ff 29%,
    #80d0ff 67%,
    #ffffff 100%
  );
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textclip 2s linear infinite;
  font-weight: bold;
  font-size: 1rem;
  margin: 0;
}

.loading-bar {
  width: 100%;
  height: 4px;  /* Height of the loading bar */
  background: linear-gradient(
    -225deg,
    #ffccff 0%,
    #b3a0ff 50%,
    #80d0ff 100%
  );
  background-size: 200%;
  animation: loading 1.5s linear infinite alternate;
}

@keyframes loading {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 0%;
  }
}

.shield-icon {
  fill: white; /* Fill color for the shield */
  transition: fill 0.5s; /* Smooth transition for color changes */
}
.shield-icon:hover {
  fill: #ffccff; /* Change color on hover */
}
`;
document.head.appendChild(styleSheet);

const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="50"  // Adjust width and height as needed
    height="50"
    viewBox="0 0 24 24"
    className="shield-icon"
  >
    <path
      d="M12 2l10 4v6a10 10 0 1 1-20 0V6l10-4z"
    />
  </svg>
);

const Header = (props) => {
  const [search, setSearch] = useState(false);

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable");
    } else {
      body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div
          className="navbar-header"
          style={{
            background: '#0E0F1B',
            color: '#fff',
          }}
        >
          <div className="d-flex align-items-center justify-content-between w-100">
            <img src={eventusLogoHorizontal} alt="eventus" width='128px' className="me-4" />
            <div className="loading-bar" />
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-sm px-3 font-size-24 header-item waves-effect paddingLeft"
                id="vertical-menu-btn"
                onClick={() => {
                  tToggle();
                }}
              >
                <i className="ri-menu-2-line align-middle"></i>
              </button>
              <NotificationDropdown />
              <ProfileMenu />
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
