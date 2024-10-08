import { z } from "zod";
import Ammonia from "./Ammonia/Ammonia.pipe.js";
import Angular from "./Angular/Angular.pipe.js";
import Custom from "./Custom/Custom.pipe.js";
import DomParser from "./DomParser/DomParser.pipe.js";
import DomPurify from "./DomPurify/DomPurify.pipe.js";
import HighlightJs from "./HighlightJs/HighlightJs.pipe.js";
import JsXss from "./JsXss/JsXss.pipe.js";
import Parse5 from "./Parse5/Parse5.pipe.js";
import SafeValues from "./SafeValues/SafeValues.pipe.js";
import SrcdocParser from "./SrcdocParser/SrcdocParser.pipe.js";
import TemplateParser from "./TemplateParser/TemplateParser.pipe.js";
import IframeView from "./IframeView/IframeView.pipe.js";
import type { Pipe } from "~/types.js";

export const pipes = [
  Ammonia,
  Angular,
  Custom,
  DomParser,
  DomPurify,
  HighlightJs,
  JsXss,
  Parse5,
  SafeValues,
  SrcdocParser,
  TemplateParser,
  IframeView,
] as const;

export const pipeParser = z
  .discriminatedUnion("name", [
    Ammonia.parser,
    Angular.parser,
    Custom.parser,
    DomParser.parser,
    DomPurify.parser,
    HighlightJs.parser,
    JsXss.parser,
    Parse5.parser,
    SafeValues.parser,
    SrcdocParser.parser,
    TemplateParser.parser,
    IframeView.parser,
  ])
  .transform<Pipe>((v) => v);
