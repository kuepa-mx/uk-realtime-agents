import cursorGuide from "./cursorGuide";
import rockPaper from "./rockPaper";
import todoList from "./todoList";
import blogInternal from "./blogInternal";
import { injectTransferTools } from "../utils";

cursorGuide.downstreamAgents = [rockPaper, todoList, blogInternal];
rockPaper.downstreamAgents = [cursorGuide, todoList, blogInternal];
todoList.downstreamAgents = [cursorGuide, rockPaper, blogInternal];
blogInternal.downstreamAgents = [cursorGuide, rockPaper, todoList];

const agents = injectTransferTools([
  cursorGuide,
  rockPaper,
  todoList,
  blogInternal,
]);

export default agents;