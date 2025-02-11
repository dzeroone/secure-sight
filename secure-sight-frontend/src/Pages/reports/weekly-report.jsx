import { addDays, getDate, getDay, isAfter, isBefore } from "date-fns";
import { useCallback, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";

export default function WeeklyReport() {

  const [selectedDate, setSelectedDate] = useState()

  const filterDate = useCallback((date) => {
    const day = getDay(date);
    return day == 1
  }, [])

  return (
    <div className="page-content">
      <Form>
        <Row>
          <Col xs="auto">
            <FormGroup>
              <Label>
                Select week
              </Label>
              <div>
                <ReactDatePicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  className="form-control"
                  filterDate={filterDate}
                  dayClassName={(date) =>
                    selectedDate && isAfter(date, selectedDate) && isBefore(date, addDays(selectedDate, 7)) ? "bg-primary" : undefined
                  }
                  shouldCloseOnSelect={false}
                />
              </div>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label>
                Tenant
              </Label>
              <Input />
            </FormGroup>
          </Col>
        </Row>
        <Button type="submit">REEE</Button>
      </Form>
    </div>
  )
}