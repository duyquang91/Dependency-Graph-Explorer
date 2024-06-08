import { CocoaPodsProvider } from "./CocoaPodsProvider";
import { DependencyProviderBase } from "./DependencyProviderBase";
import { NodePackageManager } from "./NodePackageManager";

export const dependencyManagerProviders: DependencyProviderBase[] = [
    new NodePackageManager(),
    new CocoaPodsProvider()
]