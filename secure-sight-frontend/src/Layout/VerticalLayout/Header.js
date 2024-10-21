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
import "./logo.css";

const Header = (props) => {
	const [search, setsearch] = useState(false);

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
						background: '#0E0F1B',// Black to purple gradient
						color: '#fff', // Ensure text is visible on the gradient background
						height: "8vh",
						padding: '10px 20px', // Adjust padding for spacing
					}}
				>
					<div className="d-flex align-items-center justify-content-between w-100">
						<h2 style={{ fontWeight: 'bold', fontSize: '30px', marginTop:"2vh" }}>
							SECURE-SIGHT
						</h2>
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

							<form className="app-search d-none d-lg-block mx-3">
								<div className="position-relative">
									<input
										type="text"
										className="form-control"
										placeholder="Search..."
										style={{ backgroundColor: "#000000", color: "#fff" }} // Ensure text is visible
									/>
									<span className="ri-search-line"></span>
								</div>
							</form>

							<div className="dropdown d-inline-block d-lg-none ms-2">
								<button
									onClick={() => {
										setsearch(!search);
									}}
									type="button"
									className="btn header-item noti-icon"
									id="page-header-search-dropdown"
								>
									<i className="ri-search-line" />
								</button>
								<div
									className={
										search
											? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
											: "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
									}
									aria-labelledby="page-header-search-dropdown"
								>
									<form className="p-3">
										<div className="form-group m-0">
											<div className="input-group">
												<input
													type="text"
													className="form-control"
													placeholder="Search ..."
													aria-label="Recipient's username"
												/>
												<div className="input-group-append">
													<button className="btn btn-primary" type="submit">
														<i className="ri-search-line" />
													</button>
												</div>
											</div>
										</div>
									 {/* Add some margin to the search form */}
										<div style={{ marginTop: '10px' }}>
											{/* Add your search results or suggestions here */}
										</div>
									</form>
								</div>
							</div>

							<ProfileMenu />

							<div className="dropdown d-inline-block"
								onClick={() => {
									props.showRightSidebarAction(!props.showRightSidebar);
								}}
							>
								<button
									type="button"
									className="btn header-item noti-icon right-bar-toggle waves-effect"
								>
									<i className="mdi mdi-cog"></i>
								</button>
							</div>
						</div>
					</div>

				</div>

			</header>
		</React.Fragment>
	);
};

const mapStatetoProps = (state) => {
	const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
		state.Layout;
	return { layoutType, showRightSidebar, leftMenu, leftSideBarType };
};

export default connect(mapStatetoProps, {
	showRightSidebarAction,
	toggleLeftmenu,
	changeSidebarType,
})(withTranslation()(Header));