import cursorGuide from "./cursorGuide";
import rockPaper from "./rockPaper";
import todoList from "./todoList";
import blogInternal from "./blogInternal";
import { injectTransferTools } from "../utils";
import websiteCreation from "./websiteCreation";
import calculatorCreation from "./calculatorCreation";
cursorGuide.downstreamAgents = [rockPaper, todoList, blogInternal, calculatorCreation];
rockPaper.downstreamAgents = [cursorGuide, todoList, blogInternal, calculatorCreation];
todoList.downstreamAgents = [cursorGuide, rockPaper, blogInternal, calculatorCreation];
blogInternal.downstreamAgents = [cursorGuide, rockPaper, todoList, calculatorCreation];
calculatorCreation.downstreamAgents = [cursorGuide, rockPaper, todoList, blogInternal];

const agents = injectTransferTools([
  cursorGuide,
  rockPaper,
  todoList,
  calculatorCreation,
  blogInternal,
  websiteCreation,
]);

export default agents;