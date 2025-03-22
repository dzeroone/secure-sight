import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, Col, Row } from "reactstrap";
import { setDocumentTitle } from "../../helpers/utils";

export default function BreadcrumbWithTitle({
  title,
  linkStack,
  endContent
}) {
  setDocumentTitle(title)
  return (
    <Row>
      <Col xs="12">
        <div className="page-title-box d-sm-flex align-items-center justify-content-between">
          <h4 className="mb-0 font-size-18">{title}</h4>
          {Array.isArray(linkStack) ? (
            <div className="page-title-right">
              <Breadcrumb listClassName="m-0">
              {linkStack.map((ls, i) => {
                const isActive = i === linkStack.length - 1
                return (
                  <BreadcrumbItem active={isActive} key={ls.route}>
                    {!isActive ? <Link to={ls.route}>{ls.title}</Link> : ls.title}
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