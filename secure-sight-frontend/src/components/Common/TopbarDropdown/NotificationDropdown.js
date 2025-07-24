import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle, Spinner } from "reactstrap";
import SimpleBar from "simplebar-react";

//Import images
// import avatar3 from "../../../assets/images/users/avatar-3.jpg";
// import avatar4 from "../../../assets/images/users/avatar-4.jpg";

//i18n
import formatRelative from "date-fns/formatRelative";
import ApiEndPoints from "../../../Network_call/ApiEndPoints";
import ApiServices from "../../../Network_call/apiservices";

const NotificationDropdown = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  const notificationTimeoutId = useRef(null)
  const lastMaxUpdated = useRef(localStorage.getItem("nlud") || "")

  const loadNotifications = useCallback(async () => {
    try {
      setOpenLoader(true)
      const response = await ApiServices(
        "get",
        null,
        ApiEndPoints.Notifications
      );
      setNotifications(response)
    } catch (e) {
      console.log(e)
    } finally {
      notificationTimeoutId.current = setTimeout(loadNotifications, 5000)
      setOpenLoader(false)
    }
  }, [])

  const maxNotificationDate = useMemo(() => {
    let max = ""
    notifications.forEach(n => {
      if (n.uAt > max) {
        max = n.uAt
      }
    })
    return max
  }, [notifications])

  const hasUpdate = useMemo(() => {
    if (lastMaxUpdated.current < maxNotificationDate) {
      localStorage.setItem('nlud', maxNotificationDate)
      lastMaxUpdated.current = maxNotificationDate
      return true
    }
    return false
  }, [maxNotificationDate])

  const formatDate = (date) => {
    return formatRelative(date, new Date())
  }

  useEffect(() => {
    loadNotifications();

    return () => {
      if (notificationTimeoutId.current) {
        clearTimeout(notificationTimeoutId.current)
      }
    }
  }, [loadNotifications])

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="ri-notification-3-line" />
          {hasUpdate ? (
            <span className="noti-dot"></span>
          ) : null}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <div className="position-relative">
              <h6 className="m-0">{"Notifications"} </h6>
              {openLoader ?
                <Spinner size='sm' className="position-absolute top-0 end-0" />
                : null}
            </div>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {notifications.map(notification => {
              return (
                <div className="text-reset notification-item" key={notification._id}>
                  <div className="d-flex" >
                    {/* <div className="flex-shrink-0 me-3">
                      <div className="avatar-xs">
                        <span className="avatar-title bg-primary rounded-circle font-size-16">
                          <i className="ri-shopping-cart-line"></i>
                        </span>
                      </div>
                    </div> */}
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{notification.title}</h6>
                      <div className="font-size-12">
                        <p className="mb-1 text-break">
                          {notification.message}
                        </p>
                        <p className="mb-0">
                          <i className="mdi mdi-clock-outline"></i> {formatDate(notification.uAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </SimpleBar>
          {/* <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 text-center"
              to="#"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>{" "}
              <span key="t-view-more">{props.t("View More..")}</span>
            </Link>
          </div> */}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NotificationDropdown;

NotificationDropdown.propTypes = {
  t: PropTypes.any,
};
