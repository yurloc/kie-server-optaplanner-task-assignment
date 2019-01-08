import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scheduler, {
  SchedulerData, ViewTypes, DATETIME_FORMAT,
} from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import moment from 'moment';

const extractScheduler = (bestSolution) => {
  const schedulerData = new SchedulerData('2018-01-01', ViewTypes.Day);
  schedulerData.localeMoment.locale('en');
  schedulerData.config.dayCellWidth = 100;

  const resources = [];
  const events = [];

  if (Object.prototype.hasOwnProperty.call(bestSolution, 'employeeList')) {
    bestSolution.employeeList.forEach((employee) => {
      const resource = {
        id: employee.id,
        name: employee.fullName,
      };
      resources.push(resource);
    });
    bestSolution.taskList.forEach((task) => {
      const start = new Date(2018, 0);
      const end = new Date(2018, 0);
      start.setMinutes(task.startTime == null ? 0 : task.startTime);
      end.setMinutes(task.endTime == null ? 10 : task.endTime);

      const event = {
        id: task.id,
        start: moment(start).format(DATETIME_FORMAT),
        end: moment(end).format(DATETIME_FORMAT),
        resourceId: task.employee,
        title: task.label,
      };
      events.push(event);
    });
  }

  events.sort((e1, e2) => e1.start.localeCompare(e2));
  schedulerData.setResources(resources);
  schedulerData.setEvents(events);

  return { schedulerData, events };
};

class Schedule extends Component {
  constructor(props) {
    super(props);

    const { schedulerData, events } = extractScheduler(props.bestSolution);

    this.state = {
      schedulerData,
      events,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { schedulerData, events } = extractScheduler(nextProps.bestSolution);
    this.setState({ schedulerData, events });
  }

  prevClick = (schedulerData) => {
    schedulerData.prev();
    schedulerData.setEvents(this.state.events);
    this.setState({ schedulerData });
  }

  nextClick = (schedulerData) => {
    schedulerData.next();
    schedulerData.setEvents(this.state.events);
    this.setState({ schedulerData });
  }

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.setEvents(this.state.events);
    this.setState({ schedulerData });
  }

  onSelectDate = (schedulerData, newDate) => {
    schedulerData.setDate(newDate);
    schedulerData.setEvents(this.state.events);
    this.setState({ schedulerData });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <Scheduler
            schedulerData={this.state.schedulerData}
            prevClick={this.prevClick}
            nextClick={this.nextClick}
            onSelectDate={this.onSelectDate}
            onViewChange={this.onViewChange}
          />
        </div>
      </div>
    );
  }
}

Schedule.propTypes = {
  bestSolution: PropTypes.instanceOf(Object).isRequired,
};

export default Schedule;
