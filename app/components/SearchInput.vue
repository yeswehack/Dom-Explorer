<template>
  <div>
    <DefineTemplate>
      <Command
        v-model:search-term="searchTerm"
        :filter-function="filterFunction as any"
      >
        <CommandInput :placeholder="searchPlaceholder ?? 'Search...'" />
        <CommandEmpty>
          {{ notFound ?? "Nothing matches..." }}
        </CommandEmpty>
        <CommandList>
          <template v-for="(group, idx) of _groups" :key="group.name">
            <CommandSeparator v-if="idx > 0" :data-name="group.name" />
            <CommandGroup :heading="group.name">
              <CommandItem
                v-for="choice of group.items"
                :key="getValue(choice)"
                :value="getValue(choice)"
                :class="cn('flex items-center gap-2', itemClass)"
                @select="
                  (ev) => {
                    if (typeof ev.detail.value === 'string') {
                      model = ev.detail.value;
                    }
                    open = false;
                  }
                "
              >
                <slot
                  :choice="choice"
                  :value="getValue(choice)!"
                  :label="getLabel(choice)!"
                  :selected="model === getValue(choice)"
                >
                  <Button
                    v-if="allowDelete"
                    size="iconSm"
                    icon="trash"
                    variant="ghost-destructive"
                    class="-ml-1"
                    @click.prevent="emit('delete', getValue(choice))"
                  />
                  <span class="flex-1 truncate">
                    {{ getLabel(choice) }}
                  </span>
                  <Icon
                    name="check"
                    :class="
                      cn(
                        'ml-auto size-4 min-w-4',
                        model === getValue(choice)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )
                    "
                  />
                </slot>
              </CommandItem>
            </CommandGroup>
          </template>
          <template v-if="allowCreate">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value="$new$"
                class="cursor-pointer"
                @click.prevent="emit('create')"
              >
                <Icon name="plus" class="mr-2 size-4" />
                {{ createLabel ?? "New" }}
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
        <slot name="footer" />
      </Command>
    </DefineTemplate>
    <div v-if="noPopover">
      <ReuseTemplate class="border" />
    </div>
    <Popover v-else v-model:open="open">
      <PopoverTrigger as-child>
        <slot name="button">
          <Button
            variant="outline"
            role="combobox"
            :aria-expanded="open"
            :class="cn('justify-between gap-2 pl-3 pr-1', buttonClass)"
            :disabled="readOnly"
          >
            {{
              model
                ? getLabel(
                    _choices.find((choice) => getValue(choice) === model),
                  )
                : label
            }}
            <Icon
              name="chevronsUpDown"
              class="ml-auto size-5 shrink-0 opacity-50"
            />
          </Button>
        </slot>
      </PopoverTrigger>
      <PopoverContent class="p-0" :align="align" :class="$props.class">
        <ReuseTemplate />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { cn } from "~/utils";

type Choice = { label: string; value: string } | string;

const props = defineProps<{
  label?: string;
  searchPlaceholder?: string;
  notFound?: string;
  align?: "start" | "end" | "center";
  groups?: { name: string; items: Choice[] }[];
  choices?: Choice[];
  itemClass?: string;
  readOnly?: boolean;
  class?: HTMLAttributes["class"];
  buttonClass?: HTMLAttributes["class"];
  noPopover?: boolean;
  allowDelete?: boolean;
  allowCreate?: boolean;
  createLabel?: string;
}>();

const emit = defineEmits<{
  delete: [string];
  create: [];
}>();

const open = ref(false);

const model = defineModel<string>({ default: () => undefined });
const searchTerm = ref("");

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const _groups = computed(() => {
  if (props.choices) {
    return [{ name: props.label ?? "", items: props.choices }];
  } else {
    return props.groups ?? [];
  }
});

function getLabel(choice?: { label: string; value: string } | string) {
  if (typeof choice === "undefined") return undefined;
  return typeof choice === "string" ? choice : choice.label;
}

function getValue(choice: { label: string; value: string } | string) {
  return typeof choice === "string" ? choice : choice.value;
}

const _choices = computed(() => {
  return _groups.value.flatMap((g) => g.items);
});

function filterFunction(items: string[], search: string) {
  return items.filter((value) => {
    if (props.allowCreate && value === "$new$") return true;
    const choice = _choices.value.find((c) => getValue(c) === value);
    const label = getLabel(choice) ?? "";
    return label.toLowerCase().includes(search.toLowerCase());
  });
}
</script>
