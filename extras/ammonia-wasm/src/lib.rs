use ammonia::Builder;
use std::collections::HashSet;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug)]
pub struct SanitizerInput {
    input: String,
    add_tags: Vec<String>,
    add_attrs: Vec<String>,
    add_urls: Vec<String>,
    strip_comment: bool,
}

#[wasm_bindgen]
impl SanitizerInput {
    #[wasm_bindgen(constructor)]
    pub fn new(
        input: String,
        add_tags: Vec<String>,
        add_attrs: Vec<String>,
        add_urls: Vec<String>,
        strip_comment: bool,
    ) -> SanitizerInput {
        SanitizerInput {
            input,
            add_tags,
            add_attrs,
            add_urls,
            strip_comment,
        }
    }
}

#[wasm_bindgen]
pub fn sanitize(input: &SanitizerInput) -> String {
    let add_tags = input.add_tags.iter().map(AsRef::as_ref).collect::<Vec<_>>();

    let mut tag_blacklist = HashSet::new();

    if !add_tags.contains(&"style") {
        tag_blacklist.insert("style");
    }

    if !add_tags.contains(&"script") {
        tag_blacklist.insert("script");
    }

    let output = Builder::new()
        .add_tags(input.add_tags.iter())
        .add_generic_attributes(input.add_attrs.iter())
        .add_url_schemes(input.add_urls.iter())
        .clean_content_tags(tag_blacklist)
        .strip_comments(input.strip_comment)
        .clean(&input.input);

    output.to_string()
}
