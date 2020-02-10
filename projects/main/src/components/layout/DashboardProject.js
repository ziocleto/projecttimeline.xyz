import React, {Fragment, useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Entries from "./entities/Entries";
import ImageEditor from "./entities/ImageEditor";
import AppEditor from "./entities/AppEditor";
import GUIEditor from "./entities/GUIEditor";
import GeomEditor from "./entities/GeomEditor";
import FontEditor from "./entities/FontEditor";
import MaterialEditor from "./entities/MaterialEditor";
import {wasmSetCanvasSize, wasmSetCanvasVisibility} from "react-wasm-canvas";
import EntityMetaSection from "./entities/EntityMetaSection";
import RenderParamsToolbar from "./entities/RenderParamsToolbar";
import {
  GroupFont,
  GroupGeom,
  groupHasMetadataSection,
  GroupImage,
  GroupMaterial,
  GroupScript,
  GroupUI
} from "../../utils/utils";

import store from "../../store";

const containerClassFromGroup = (currEntity, group) => {
  switch (group) {
    case GroupGeom:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <GeomEditor/>
      };
    case GroupMaterial:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <MaterialEditor/>
      };
    case GroupImage:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <ImageEditor/>
      };
    case GroupScript:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <AppEditor/>
      };
    case GroupFont:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <FontEditor/>
      };
    case GroupUI:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <GUIEditor/>
      };
    default:
      return {
        mainContainerClass: "AppEditorRenderGrid",
        mainContainerDiv: <AppEditor/>
      };
  }
};

const DashboardProject = ({
                            resize,
                            currentEntity,
                            entities,
                            group,
                            userData
                          }) => {
  let canvasContainer = React.useRef(null);

  useEffect(() => {
    // Shortcut to go straight to app/coding from the outset for most projects
    // if (group === "" && entities.length === 1 && !currentEntity) {
    //   store.dispatch(getFullEntity(entities[0]));
    // }
    store.dispatch(
      wasmSetCanvasVisibility(
        currentEntity && group !== "" ? "visible" : "hidden"
      )
    );
    console.log("Invalidate: dashboard project");
  }, [currentEntity, entities, group]);

  if (!userData || !userData.project) {
    return <Fragment></Fragment>;
  }

  const {mainContainerClass, mainContainerDiv} = containerClassFromGroup(
    currentEntity,
    group
  );

  // const bUseEntityUpdate = groupHasUpdateFacility(currentEntity, group);
  const bShowMetaSection = groupHasMetadataSection(currentEntity, group);

  if (canvasContainer.current) {
    const rect = canvasContainer.current.getBoundingClientRect();
    store.dispatch(wasmSetCanvasSize(rect));
  }

  const entityName = (
    <div className="source_tabs-a">
      <div className="source_tabs-internal">
        {currentEntity && currentEntity.entity.name}
      </div>
    </div>
  );

  const mainEditorDiv = (
    <div className={mainContainerClass}>
      {entityName}
      <RenderParamsToolbar/>
      <div className="EntryEditorRender" ref={canvasContainer}></div>
      {currentEntity && mainContainerDiv}
      {bShowMetaSection && <EntityMetaSection/>}
    </div>
  );

  return (
    <div className="dashboardContainer">
      <Entries cname="thumbs-a thumbsEntityArea"/>
      <div className="editor-a">{mainEditorDiv}</div>
    </div>
  );
};

DashboardProject.propTypes = {
  resize: PropTypes.bool,
  currentEntity: PropTypes.object,
  entities: PropTypes.array,
  group: PropTypes.string,
  userData: PropTypes.object
};

const mapStateToProps = state => ({
  resize: state.wasm.resize,
  currentEntity: state.entities.currentEntity,
  entities: state.entities.entries,
  group: state.entities.group,
  userData: state.auth.userdata
});

export default connect(
  mapStateToProps,
  {}
)(DashboardProject);
