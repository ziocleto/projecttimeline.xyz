import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
const moment = require("moment");

const EntityInfo = ({ currentEntity }) => {
  const creationDate =
    currentEntity && currentEntity.entity.creationDate
      ? moment(currentEntity.entity.creationDate).fromNow()
      : "1st Jan 1970";
  const updateDate =
    currentEntity &&
    currentEntity.entity.lastUpdatedDate &&
    currentEntity.entity.lastUpdatedDate !==
      currentEntity.entity.creationDate
      ? moment(currentEntity.entity.lastUpdatedDate).fromNow()
      : "Never";

  const hs = currentEntity ? currentEntity.entity.hash : "";
  const pad = 6;
  const hashContrived = currentEntity
    ? hs.slice(0, pad) + "..." + hs.slice(hs.length - pad, hs.length)
    : hs;

  return (
    <div className="entity-info-a">
      <p>
        <i className="fas fa-info-circle"> </i> Info
      </p>
      <div className="entity-info-c">
        <span className="metaInfiTitle small text-pale">
          <i className="fas fa-user" />
          &nbsp;owner&nbsp;
        </span>
        <span className="metaInfoValue normal text-secondary">
          {currentEntity.entity.creator
            ? currentEntity.entity.creator.name
            : currentEntity.entity.project}
        </span>
        <br />
        <span className="metaInfiTitle small text-pale">
          <i className="fas fa-clock" />
          &nbsp;created&nbsp;
        </span>
        <span className="metaInfoValue normal text-secondary">
          {creationDate}
        </span>
        <br />
        <span className="metaInfiTitle small text-pale">
          <i className="fas fa-calendar" />
          &nbsp;updated&nbsp;
        </span>
        <span className="metaInfoValue normal text-secondary">
          {updateDate}
        </span>
        <br />
        <span className="metaInfiTitle small text-pale">
          <i className="fas fa-code" />
          &nbsp;hash
        </span>
        <span className="metaInfoValueNoOff extra-small text-secondary">
          {hashContrived}
        </span>
        <br />
      </div>
    </div>
  );
};

EntityInfo.propTypes = {
  currentEntity: PropTypes.object
};

const mapStateToProps = state => ({
  currentEntity: state.entities.currentEntity
});

export default connect(mapStateToProps)(EntityInfo);
