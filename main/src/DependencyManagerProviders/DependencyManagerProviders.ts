import { CocoaPodsProvider } from "./CocoaPodsProvider";
import { DependencyProviderInterface } from "./DependencyProvider";

export const dependencyManagerProviders: DependencyProviderInterface[] = [
    new CocoaPodsProvider()
]