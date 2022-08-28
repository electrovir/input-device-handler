export type Constructed<ConstructorFunction extends Readonly<new (...args: any[]) => any>> =
    ConstructorFunction extends new (...args: any[]) => infer ConstructorReturnType
        ? ConstructorReturnType
        : never;

export type AnyConstructor<ConstructedType> = new (...args: any[]) => ConstructedType;
