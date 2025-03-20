import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Col, Row } from "reactstrap";

export default function BreadcrumbWithTitle({
  title,
  linkStack,
  endContent
}) {
  document.title = `${title} | Eventus Reporting`
  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18">{title}</h4>
          {Array.isArray(linkStack) ? (
            <div className="page-title-right">
              <Breadcrumb listClassName="m-0">
              {linkStack.map((ls, i) => {
                return (
                  <BreadcrumbItem active={i === linkStack.length - 1} key={ls.route}>
                    <Link to={ls.route}>{ls.title}</Link>
                  </BreadcrumbItem>
                )
              })}
              </Breadcrumb>
            </div>
          ) : endContent ? endContent : null}
        </div>
      </Col>
    </Row>
  )
}