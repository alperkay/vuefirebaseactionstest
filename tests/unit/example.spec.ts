import { mount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

const drawable = jest.fn();

describe("Home.vue", () => {
  it("renders props.msg when passed", () => {
    const wrapper = mount(Home, {
      global: {
        directives: {
          drawable,
        },
      },
    });
    expect(wrapper.text()).toContain("luna");
  });
});
