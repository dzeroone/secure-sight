import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../withRouter";

// users
// import user1 from "../../../assets/images/users/avatar-1.jpg";
import user1 from "../../../assets/images/logo/Images/profile.png";
import { useProfile } from "../../../Hooks/UserHooks";
import { getRoleTitle } from "../../../helpers/utils";

const ProfileMenu = (props) => {
	// Declare a new state variable, which we'll call "menu"
	const [menu, setMenu] = useState(false);
	const { userProfile } = useProfile()

	return (
		<React.Fragment>
			<Dropdown
				isOpen={menu}
				toggle={() => setMenu(!menu)}
				className="d-inline-block"
			>
				<DropdownToggle
					className="btn header-item "
					id="page-header-user-dropdown"
					tag="button"
				>
					<div className="d-inline-flex align-items-center">
						<div className="position-relative">
							<img
								className="rounded-circle header-profile-user"
								src={user1}
								alt="Header Avatar"
							/>
						</div>
					</div>
					{/* <span className="d-none d-xl-inline-block ms-2 me-2">{username}</span>
					<i className="mdi mdi-chevron-down d-none d-xl-inline-block" /> */}
				</DropdownToggle>
				<DropdownMenu className="dropdown-menu-end" style={{ maxWidth: '17rem' }}>
					<DropdownItem text>
						<div className="text-truncate" title={userProfile?.email}>{userProfile?.email}</div>
						<small>{getRoleTitle(userProfile?.role)}</small>
					</DropdownItem>
					<DropdownItem divider />
					<Link to="/userprofile" className="dropdown-item">
						<i className="ri-user-line align-middle me-2" />
						<span>{props.t("Profile")}</span>
					</Link>
					<Link to="/logout" className="dropdown-item">
						<i className="ri-shut-down-line align-middle me-2 text-danger" />
						<span>{props.t("Logout")}</span>
					</Link>
				</DropdownMenu>
			</Dropdown>
		</React.Fragment>
	);
};

ProfileMenu.propTypes = {
	success: PropTypes.any,
	t: PropTypes.any,
};

const mapStatetoProps = (state) => {
	const { error, success } = state.profile;
	return { error, success };
};

export default withRouter(
	connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
