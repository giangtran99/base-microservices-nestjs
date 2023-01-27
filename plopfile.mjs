// eslint-disable-next-line @typescript-eslint/no-var-requires
export default function (plop) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires

  // controller generator
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        description: "modelName + 's'",
        message: "Type model's name that u want add CRUD:",
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{name}}/{{name}}.controller.ts',
        templateFile: 'plop-templates/resource/controller.hbs',
        skipIfExists: true,
      },
      {
        type: 'add',
        path: 'src/{{name}}/{{name}}.service.ts',
        templateFile: 'plop-templates/resource/service.hbs',
        skipIfExists: true,
      },
      {
        type: 'add',
        path: 'src/{{name}}/{{name}}.module.ts',
        templateFile: 'plop-templates/resource/module.hbs',
        skipIfExists: true,
      },
      {
        type: 'add',
        path: 'src/{{name}}/entities/{{removePlural name}}.entity.ts',
        templateFile: 'plop-templates/entities/entity.hbs',
        skipIfExists: true,
      },
      {
        type: 'add',
        path: 'src/{{name}}/dto/create-{{removePlural name}}.dto.ts',
        templateFile: 'plop-templates/dto/create.hbs',
        skipIfExists: true,
      },
      {
        type: 'add',
        path: 'src/{{name}}/dto/update-{{removePlural name}}.dto.ts',
        templateFile: 'plop-templates/dto/update.hbs',
        skipIfExists: true,
      },
    ],
  });
  // helpler generator
  plop.setHelper('removePlural', function (text) {
    //remove 's' character
    return text.slice(0, -1);
  });
  plop.setHelper('titleCase-removePlural', function (text) {
    //uppercase first character
    return text[0].toUpperCase() + text.slice(1, -1);
  });
}
